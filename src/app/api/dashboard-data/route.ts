import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth/auth-client"; // Your better-auth instance

export async function GET(req: NextRequest) {
  //   const session = await getSession();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // const userId = session.user.id;

    // Fetch recent cover letter roots
    const recentCoverLetterRoots = await prisma.coverLetterRoot.findMany({
      where: { userId: userId },
      orderBy: { updatedAt: "desc" },
      take: 5, // Get the 5 most recent
      select: {
        id: true,
        currentJobRole: true,
        currentCompany: true,
        updatedAt: true,
        // You might want to select a specific version's content or metadata if needed for preview
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          select: { content: true },
        },
      },
    });

    // Fetch current user data for accurate counts (optional, if session data isn't sufficient/fresh)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPro: true, coverLetterCountPerMonth: true },
    });

    return new NextResponse(
      JSON.stringify({
        recentLetters: recentCoverLetterRoots,
        userData: user, // Uncomment if you fetch fresh user data
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching dashboard data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
