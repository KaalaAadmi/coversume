import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth/auth";
import { z } from "zod";

const bodySchema = z.object({
  content: z.string(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { versionId: string } }
) {
  // const userId = session.user.id; // Assuming you'll revert to session-based auth
  // For now, using the one from your current code:
  const searchParams = new URL(req.url).searchParams;
  const userId = searchParams.get("userId");

  try {
    // Re-enable session-based authentication once stable
    // const session = await auth.getSession(req);
    // const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { versionId } = params;

    if (!versionId || typeof versionId !== "string") {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Version ID provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const json = await req.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request body",
          errors: parsed.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { content } = parsed.data;

    // --- User monthly count reset logic (can stay, as it's a general state update) ---
    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (userToUpdate && !userToUpdate.isPro) {
      const now = new Date();
      const currentMonthYear = {
        month: now.getUTCMonth(),
        year: now.getUTCFullYear(),
      };
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
          // New month, reset count and update reset date
          userLastReset = new Date(
            Date.UTC(currentMonthYear.year, currentMonthYear.month, 1)
          );
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
      // REMOVED: Limit check for this specific update action
      // const monthlyFreeLimit = process.env.MONTHLY_FREE_LIMIT
      //   ? Number(process.env.MONTHLY_FREE_LIMIT)
      //   : 3;
      // if (userMonthlyCount >= monthlyFreeLimit) { // userMonthlyCount is not defined here anymore
      //   return new NextResponse(
      //     JSON.stringify({ message: "Monthly save/edit limit reached." }),
      //     { status: 403 }
      //   );
      // }
    }
    // --- End user monthly count reset logic ---

    const updatedVersion = await prisma.$transaction(async (tx) => {
      // Find the version and ensure it belongs to the user
      const versionToUpdate = await tx.coverLetterVersion.findUnique({
        where: { id: versionId },
        include: { root: true },
      });

      if (!versionToUpdate || versionToUpdate.root.userId !== userId) {
        throw new Error("Version not found or access denied."); // This will cause transaction to rollback
      }

      // Update the version
      const newVersionData = await tx.coverLetterVersion.update({
        where: { id: versionId },
        data: {
          content: content,
          // refinementTypeUsed: "manual_edit_update", // Optional: new type for updated edits
        },
      });

      // Touch updatedAt on the root
      await tx.coverLetterRoot.update({
        where: { id: versionToUpdate.rootId },
        data: { updatedAt: new Date() },
      });

      // REMOVED: Increment user counts for this update action
      // if (shouldApplyLimits && userToUpdate) { // shouldApplyLimits is not defined here anymore
      //   await tx.user.update({
      //     where: { id: userId },
      //     data: {
      //       coverLetterCount: { increment: 1 },
      //       coverLetterCountPerMonth: { increment: 1 },
      //     },
      //   });
      // }
      return newVersionData;
    });

    return new NextResponse(JSON.stringify(updatedVersion), {
      status: 200, // 200 OK for update
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(
      `Error updating cover letter version ${params.versionId}:`,
      error
    );
    let message = "Error updating cover letter version";
    let statusCode = 500;
    if (error.message === "Version not found or access denied.") {
      message = error.message;
      statusCode = 404;
    } else if (error instanceof Error && (error as any).code === "P2023") {
      message = "Invalid ID format for update.";
      statusCode = 400;
    }
    return new NextResponse(JSON.stringify({ message }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" }, // Added headers to error response
    });
  }
}
