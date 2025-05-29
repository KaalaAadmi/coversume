import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return new NextResponse(
        JSON.stringify({ message: "Slug parameter is missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const blogPost = await prisma.blogPost.findUnique({
      where: {
        slug: slug,
        published: true, // Ensure only published posts are fetched by slug directly
      },
      // Select all fields needed for the detailed blog post view
      // select: { ... } // Or omit select to get all fields by default
      // If you have a select statement, add keywords: true
      // select: {
      //   // ... other fields
      //   keywords: true,
      // }
      // If no select, all fields including keywords are fetched by default.
    });

    if (!blogPost) {
      return new NextResponse(
        JSON.stringify({ message: "Blog post not found or not published" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    // blogPost.content = blogPost.content.replace(/\n/g, "<br/>");
    return new NextResponse(JSON.stringify(blogPost), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error fetching blog post by slug ${params.slug}:`, error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching blog post" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
