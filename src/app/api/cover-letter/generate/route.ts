// import { streamText } from "ai";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
// import OpenAI from "openai";

const bodySchema = z.object({
  date: z.string(),
  resumeText: z.string(),
  jobDescription: z.string(),
  resumeFileUrl: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  portfolioUrl: z.string().optional(),
  language: z.string().default("English"),
  userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response("Invalid request", { status: 400 });
  }

  const {
    date,
    resumeText,
    jobDescription,
    // resumeFileUrl,
    name,
    email,
    phoneNumber,
    portfolioUrl,
    language,
    userId,
  } = parsed.data;

  //   console.log(JSON.stringify(json, null, 2));
  //   console.log(
  //     `resumeText: ${resumeText}, jobDescription: ${jobDescription}, resumeFileUrl: ${resumeFileUrl}, name: ${name}, email: ${email}, phoneNumber: ${phoneNumber}, portfolioUrl: ${portfolioUrl}, language: ${language}, userId: ${userId}`
  //   );

  let userToUpdate = null;
  let shouldUpdateUserCounts = false;

  if (userId) {
    userToUpdate = await prisma.user.findUnique({ where: { id: userId } });
    shouldUpdateUserCounts = true; // Assume we'll update if user exists
  }

  if (userToUpdate && !userToUpdate.isPro) {
    // For non-Pro users, check limits before proceeding (optional, implement if needed)
    const now = new Date();
    const currentMonthYear = {
      month: now.getUTCMonth(),
      year: now.getUTCFullYear(),
    }; // Use UTC for consistency
    let userMonthlyCount = userToUpdate.coverLetterCountPerMonth;
    let userLastReset = userToUpdate.monthlyCountLastReset;

    // Check if the month needs to be reset
    if (userLastReset) {
      const lastResetMonthYear = {
        month: userLastReset.getUTCMonth(),
        year: userLastReset.getUTCFullYear(),
      };
      if (
        currentMonthYear.year > lastResetMonthYear.year ||
        (currentMonthYear.year === lastResetMonthYear.year &&
          currentMonthYear.month > lastResetMonthYear.month)
      ) {
        // New month, reset count and update reset date
        userMonthlyCount = 0; // Reset count before incrementing for the current action
        // Set userLastReset to the beginning of the current month for clarity
        userLastReset = new Date(
          Date.UTC(currentMonthYear.year, currentMonthYear.month, 1)
        );

        // Persist this reset immediately if it's a new month, even before the limit check for the current action
        // This ensures the reset happens regardless of whether the current action is allowed
        await prisma.user.update({
          where: { id: userId },
          data: {
            coverLetterCountPerMonth: 0, // Reset to 0
            monthlyCountLastReset: userLastReset,
          },
        });
      }
    } else {
      // No reset date means this is effectively the first count in a cycle for a new month
      userMonthlyCount = 0;
      userLastReset = new Date(
        Date.UTC(currentMonthYear.year, currentMonthYear.month, 1)
      );
      await prisma.user.update({
        where: { id: userId },
        data: {
          coverLetterCountPerMonth: 0,
          monthlyCountLastReset: userLastReset,
        },
      });
    }
    // Now check limit with potentially reset count
    const monthlyFreeLimit = process.env.MONTHLY_FREE_LIMIT
      ? Number(process.env.MONTHLY_FREE_LIMIT)
      : 3;
    if (userMonthlyCount >= monthlyFreeLimit) {
      return new NextResponse(
        JSON.stringify({
          message: "Monthly generation/refinement limit reached.",
        }),
        { status: 403 }
      );
    }
  }

  const prompt = `You are an expert recruitment copywriter.
Perform two tasks in **one** response:
1. Extract the job role/title and company name from the job description.
Return them as JSON on a single line: { "jobRole": "…", "company": "…" }
If either value cannot be determined, set it to null.
2. After a line containing only five hyphens ("-----"), write a personalized cover letter for the job role based on the following directions.
A markdown formatted personalized cover letter.
The letter must be compelling and follow Harvard Career Services formatting and following the practices mentioned by harvard career services for creating a cover letter.
- Do not fabricate any skills. If a skill from the job is missing in the resume, find a related/transferable skill and mention eagerness to learn, fast learning capability, and refer to portfolio link if available.
- Use a professional but approachable tone.
- Write the letter in first person.
- Use formal tone, no more than four paragraphs.
- Include the following contact info at the top:
- Name: ${name || "[Name not provided]"}
- Email: ${email || "[Email not provided]"}
- Phone: ${phoneNumber || "[Phone not provided]"}
- Portfolio: ${portfolioUrl || "[Portfolio not provided]"}
- Write the cover letter in: ${language || "English"}.
- Today's date: ${date}
You need to make sure that you don't write anything before the JSON object.
The JSON object should be the first thing in your response.
The JSON object should be valid and parsable.
Following the JSON object, write the separator, and then, write the cover letter.
You should not write anything else.
Change the date format to "Month Day, Year" (e.g., "January 1, 2023").
The cover letter should follow the following format(as per Harvard Career Services):

Your Name
Street Address
City, State Zip Code

Month Day, Year

Contact Name
Title (if known)
Organization Name
Street Address
City, State Zip Code 

followed by the content of the cover letter.
### Resume:
${resumeText}

### Job Description:
${jobDescription}

### EXAMPLE OUTPUT:
{
    "jobRole": "Software Engineer",
    "company": "Tech Corp"
}

-----

markdown formatted cover letter in harvard career services format
`;

  //   const result = await streamText({
  //     model: openai("gpt-4o"),
  //     prompt,
  //   });
  //   THIS WORKS:
  try {
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt,
    });
    console.log("RESULT: ", JSON.stringify(result));
    // Extract the final full string output after streaming
    const results = result.text.split("\n-----\n");
    const jsonPart = results[0];
    const cleaned = jsonPart.replace(/```json\n|\n```/g, "");
    let jsonData: { jobRole: string | null; company: string | null };
    try {
      jsonData = JSON.parse(cleaned);
      console.log(jsonData.jobRole); // "Frontend Engineer"
      console.log(jsonData.company); // "Intercom"
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      jsonData = { jobRole: null, company: null };
    }
    // const jsonData = JSON.parse(jsonPart);
    const coverLetter = results[1];

    // const newCoverLetterRoot = await prisma.coverLetterRoot.create({
    //   data: {
    //     originalResumeText: resumeText,
    //     // resumeFileUrl: resumeFileUrl !== undefined ? resumeFileUrl : null,
    //     originalJobDescription: jobDescription,
    //     // coverLetter,
    //     originalName: name,
    //     originalEmail: email,
    //     originalPhoneNumber: phoneNumber,
    //     originalPortfolioUrl: portfolioUrl !== "" ? portfolioUrl : null,
    //     originalLanguage: language,
    //     currentJobRole: jsonData.jobRole,
    //     currentCompany: jsonData.company,
    //     originalDate: date,
    //     userId,
    //     versions: {
    //       create: [
    //         {
    //           content: coverLetter,
    //           versionNumber: 1,
    //           refinementTypeUsed: "initial",
    //         },
    //       ],
    //     },
    //   },
    //   include: {
    //     versions: {
    //       where: { versionNumber: 1 }, // Ensure we get the first version
    //     },
    //   },
    // });
    // Transaction to create cover letter and update user counts
    const newCoverLetterRoot = await prisma.$transaction(async (tx) => {
      const createdRoot = await tx.coverLetterRoot.create({
        data: {
          userId: userId || null,
          originalResumeText: resumeText,
          originalJobDescription: jobDescription,
          originalName: name,
          originalEmail: email,
          originalPhoneNumber: phoneNumber,
          originalPortfolioUrl: portfolioUrl !== "" ? portfolioUrl : null,
          originalLanguage: language,
          originalDate: date,
          currentJobRole: jsonData.jobRole,
          currentCompany: jsonData.company,
          versions: {
            create: [
              {
                content: coverLetter,
                versionNumber: 1,
                refinementTypeUsed: "initial",
              },
            ],
          },
        },
        include: {
          versions: {
            where: { versionNumber: 1 },
          },
        },
      });

      if (shouldUpdateUserCounts && userToUpdate) {
        const updateData: any = {
          coverLetterCount: { increment: 1 },
        };

        if (!userToUpdate.isPro) {
          // Increment the monthly count. The reset to 0 (if new month) happened *before* the limit check.
          updateData.coverLetterCountPerMonth = { increment: 1 };
          // monthlyCountLastReset was already updated if it was a new month.
          // If it's the same month, we don't touch monthlyCountLastReset here.
        }
        // For Pro users, only total count is incremented if they are not subject to monthly limits.
        // If Pro users have their own monthly limits, that logic would be added here.

        await tx.user.update({
          where: { id: userId },
          data: updateData,
        });
      }
      return createdRoot;
    });

    const firstVersion = newCoverLetterRoot.versions[0];
    return new NextResponse(
      JSON.stringify({
        rootId: newCoverLetterRoot.id, // Send rootId to frontend
        versionId: firstVersion.id, // Send versionId of the created version
        jobRole: newCoverLetterRoot.currentJobRole,
        company: newCoverLetterRoot.currentCompany,
        coverLetter: firstVersion.content,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/cover-letter/generate:", error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong during generation!" }),
      { status: 500 }
    );
  }

  //   result.text.then((completionText: string) => {
  //     let jobRole: string | undefined;
  //     let company: string | undefined;
  //     let coverLetter = "";

  //     const match = completionText.match(/\{[\s\S]*?\}/);

  //     if (match) {
  //       try {
  //         const jsonPart = match[0];
  //         const parsedJson = JSON.parse(jsonPart);
  //         jobRole = parsedJson.jobRole;
  //         company = parsedJson.company;
  //         coverLetter = completionText.replace(jsonPart, "").trim();
  //       } catch (err) {
  //         console.error("JSON parse error:", err);
  //         coverLetter = completionText;
  //       }
  //     } else {
  //       coverLetter = completionText;
  //     }

  //     prisma.coverLetter
  //       .create({
  //         data: {
  //           resumeText,
  //           resumeFileUrl: resumeFileUrl !== undefined ? resumeFileUrl : null,
  //           jobDescription,
  //           coverLetter,
  //           name,
  //           email,
  //           phoneNumber,
  //           portfolioUrl: portfolioUrl !== "" ? portfolioUrl : null,
  //           language,
  //           jobRole,
  //           company,
  //           userId,
  //         },
  //       })
  //       .catch((err) => console.error("DB insert error:", err));
  //   });

  // Send stream to client
  //   return result.toDataStreamResponse(); // Correct method for streaming
}
