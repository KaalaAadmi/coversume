import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { rootId: string } }
) {
  const { rootId } = params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // Expecting userId for authorization

  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized: userId is missing" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!rootId) {
    return new NextResponse(
      JSON.stringify({ message: "Bad Request: rootId is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const coverLetterRoot = await prisma.coverLetterRoot.findUnique({
      where: {
        id: rootId,
        userId: userId, // Ensure the user owns this root
      },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" }, // Get all versions, newest first
          select: {
            id: true,
            versionNumber: true,
            content: true, // Fetch content for display
            createdAt: true,
            refinementTypeUsed: true,
          },
        },
      },
    });

    if (!coverLetterRoot) {
      return new NextResponse(
        JSON.stringify({ message: "Cover letter not found or access denied" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(JSON.stringify(coverLetterRoot), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching cover letter root:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching cover letter data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { rootId: string } }
) {
  const searchParams = new URL(req.url).searchParams;
  const userId = searchParams.get("userId"); // Expecting userId for authorization
  try {
    // const session = await auth.getSession(req);
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { rootId } = params;
    // const userId = session.user.id;

    if (!rootId || typeof rootId !== "string") {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Root ID provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // First, verify the user owns the cover letter root
    const coverLetterRoot = await prisma.coverLetterRoot.findUnique({
      where: {
        id: rootId,
        userId: userId,
      },
    });

    if (!coverLetterRoot) {
      return new NextResponse(
        JSON.stringify({ message: "Cover letter not found or access denied." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If found and user is authorized, delete it
    // Prisma's onDelete: Cascade should handle deleting associated versions
    await prisma.coverLetterRoot.delete({
      where: {
        id: rootId,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Cover letter deleted successfully." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`Error deleting cover letter root ${params.rootId}:`, error);
    let message = "Error deleting cover letter";
    let statusCode = 500;

    if (error instanceof Error && (error as any).code === "P2023") {
      message = "Invalid ID format for deletion.";
      statusCode = 400;
    } else if (error instanceof Error && (error as any).code === "P2025") {
      // Record to delete not found, could happen if already deleted by another request
      message = "Cover letter not found or already deleted.";
      statusCode = 404;
    }

    return new NextResponse(JSON.stringify({ message }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
}
