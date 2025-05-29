import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
// import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // Expecting userId from frontend

  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized: userId is missing" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const searchTerm = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.CoverLetterRootWhereInput = {
      userId: userId,
      ...(searchTerm && {
        OR: [
          {
            currentCompany: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            currentJobRole: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    const coverLetterRoots = await prisma.coverLetterRoot.findMany({
      where: whereCondition,
      orderBy: { updatedAt: "desc" },
      skip: skip,
      take: limit,
      select: {
        id: true,
        currentCompany: true,
        currentJobRole: true,
        updatedAt: true,
        versions: {
          select: { id: true }, // Only select version IDs for count
        },
        _count: {
          select: { versions: true },
        },
      },
    });

    const totalRoots = await prisma.coverLetterRoot.count({
      where: whereCondition,
    });

    const formattedData = coverLetterRoots.map((root) => ({
      id: root.id,
      company: root.currentCompany || "N/A",
      position: root.currentJobRole || "N/A",
      date: root.updatedAt.toISOString(),
      versionCount: root.versions.length,
    }));

    return new NextResponse(
      JSON.stringify({
        letters: formattedData,
        totalPages: Math.ceil(totalRoots / limit),
        currentPage: page,
        totalItems: totalRoots,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching history data:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching history data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
