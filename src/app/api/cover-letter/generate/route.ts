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
    resumeFileUrl,
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
    let jsonData;
    try {
      jsonData = JSON.parse(cleaned);
      console.log(jsonData.jobRole); // "Frontend Engineer"
      console.log(jsonData.company); // "Intercom"
    } catch (err) {
      console.error("Failed to parse JSON:", err);
    }
    // const jsonData = JSON.parse(jsonPart);
    const coverLetter = results[1];

    prisma.coverLetter
      .create({
        data: {
          resumeText,
          resumeFileUrl: resumeFileUrl !== undefined ? resumeFileUrl : null,
          jobDescription,
          coverLetter,
          name,
          email,
          phoneNumber,
          portfolioUrl: portfolioUrl !== "" ? portfolioUrl : null,
          language,
          jobRole: jsonData.jobRole,
          company: jsonData.company,
          userId,
        },
      })
      .catch((err) => {
        console.error("DB insert error:", err);
        return new NextResponse(
          JSON.stringify({ message: "Something went wrong!" }),
          { status: 500 }
        );
      });
    return new NextResponse(
      JSON.stringify({
        jobRole: jsonData.jobRole,
        company: jsonData.company,
        coverLetter: coverLetter,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating text:", error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
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
