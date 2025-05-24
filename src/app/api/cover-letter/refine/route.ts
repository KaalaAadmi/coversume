import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bodySchema = z.object({
  rootId: z.string(),
  date: z.string(),
  refinementType: z.string(),
  coverLetter: z.string(),
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
    rootId,
    date,
    refinementType,
    coverLetter,
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

  // --- Logic to update user counts and check limits (mirrored from generate route) ---
  let userToUpdate = null;
  let shouldUpdateUserCounts = false;

  if (userId) {
    userToUpdate = await prisma.user.findUnique({ where: { id: userId } });
    shouldUpdateUserCounts = true;
  }

  if (userToUpdate && !userToUpdate.isPro) {
    const now = new Date();
    const currentMonthYear = {
      month: now.getUTCMonth(),
      year: now.getUTCFullYear(),
    };

    let userMonthlyCount = userToUpdate.coverLetterCountPerMonth;
    let userLastReset = userToUpdate.monthlyCountLastReset;

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
    } else {
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

    const monthlyFreeLimit = process.env.MONTHLY_FREE_LIMIT
      ? Number(process.env.MONTHLY_FREE_LIMIT)
      : 3;
    if (userMonthlyCount >= monthlyFreeLimit) {
      return new NextResponse(
        JSON.stringify({
          message: "Monthly refinement/generation limit reached.",
        }),
        { status: 403 }
      );
    }
  }
  // --- End user count and limit logic ---

  // Fetch the root to get the count of existing versions to determine the next version number
  const existingRoot = await prisma.coverLetterRoot.findUnique({
    where: { id: rootId },
    include: {
      _count: {
        select: { versions: true },
      },
    },
  });

  if (!existingRoot) {
    return new NextResponse(
      JSON.stringify({ message: "Cover letter root not found." }),
      { status: 404 }
    );
  }

  const nextVersionNumber = existingRoot._count.versions + 1;

  const prompt = `You are an expert recruitment copywriter and editor.

Your task is to refine an existing cover letter to improve its effectiveness based on the selected refinement mode. Do **not** regenerate the letter from scratch — instead, preserve the original structure and paragraphs, but apply the specific improvements as required.

Respond with **only** the refined markdown-formatted cover letter. Do not include any commentary, explanation, or extra content.

### Refinement Mode:
${refinementType}  // one of: "more concise", "more formal tone", "more confident language", "emphasize achievements"

### Instructions:
- Maintain the original structure and Harvard Career Services formatting.
- Do **not** change factual information or add new fabricated achievements.
- Apply only the necessary changes based on the selected mode:
  - **More concise**: Trim redundancy, tighten sentences.
  - **More formal tone**: Adjust phrasing to sound more professional.
  - **More confident language**: Replace uncertain or tentative language with assertive, confident phrasing.
  - **Emphasize achievements**: Highlight quantifiable results and real accomplishments more clearly.

Return only the refined version of the cover letter in markdown format.

### Original Cover Letter:
${coverLetter}`;

  try {
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt,
    });

    const refinedContent = result.text.trim();

    // Transaction to create new version and update user counts
    const [, newVersion] = await prisma.$transaction(async (tx) => {
      await tx.coverLetterRoot.update({
        // Ensure root's updatedAt is touched
        where: { id: rootId },
        data: { updatedAt: new Date() },
      });

      const createdVersion = await tx.coverLetterVersion.create({
        data: {
          rootId: rootId,
          content: refinedContent,
          versionNumber: nextVersionNumber,
          refinementTypeUsed: refinementType,
        },
      });

      if (shouldUpdateUserCounts && userToUpdate) {
        // Check userToUpdate again
        const updateData: any = {
          coverLetterCount: { increment: 1 },
        };

        if (!userToUpdate.isPro) {
          updateData.coverLetterCountPerMonth = { increment: 1 };
          // monthlyCountLastReset was already updated if it was a new month.
        }
        // For Pro users, only total count is incremented if they are not subject to monthly limits.

        await tx.user.update({
          where: { id: userId }, // userId must be available here
          data: updateData,
        });
      }
      // The transaction expects an array, so we return a structure that matches.
      // If the first operation was the root update, and second was version create.
      return [null, createdVersion];
    });

    return new NextResponse(
      JSON.stringify({
        versionId: newVersion.id,
        coverLetter: newVersion.content,
        versionNumber: newVersion.versionNumber,
        rootId: rootId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error refining cover letter:", error);
    if (
      error instanceof Error &&
      error.message.includes("Transaction failed")
    ) {
      return new NextResponse(
        JSON.stringify({
          message: "Failed to save refinement data. Please try again.",
        }),
        { status: 500 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong during refinement!" }),
      { status: 500 }
    );
  }
}
