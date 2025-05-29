import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth/auth"; // Assuming you want to protect this route

// Schema for validating the request body, based on your frontend form
const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Blog content must be at least 50 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"), // Changed from 'tag' to 'category'
  image: z.string().url("Invalid image URL").optional().nullable(), // Image URL
  readTime: z.string().optional(), // e.g., "5 min read"
  keywords: z.array(z.string()).optional().default([]), // Add keywords validation
  // published: z.boolean().default(true), // Or handle publishing status differently
});

// Function to generate a slug (you might want a more robust slugify library)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export async function POST(req: NextRequest) {
  try {
    // Optional: Protect this route (e.g., only admins can create posts)
    // const session = await auth.getSession(req);
    // if (!session?.user?.isAdmin) { // Assuming an isAdmin field on your User model
    //   return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    // }

    const json = await req.json();
    const parsed = blogPostSchema.safeParse(json);

    if (!parsed.success) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid request body",
          errors: parsed.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const {
      title,
      content,
      excerpt,
      author,
      category,
      image,
      readTime,
      keywords,
    } = parsed.data;

    // Generate a unique slug
    let slug = generateSlug(title);
    let existingPost = await prisma.blogPost.findUnique({ where: { slug } });
    let counter = 1;
    while (existingPost) {
      slug = `${generateSlug(title)}-${counter}`;
      existingPost = await prisma.blogPost.findUnique({ where: { slug } });
      counter++;
    }

    const newBlogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        author,
        category,
        image: image || null,
        readTime: readTime || null,
        keywords: keywords || [],
        published: true, // Default to published, or get from request
        publishedAt: new Date(), // Set publish date to now
      },
    });

    return new NextResponse(JSON.stringify(newBlogPost), {
      status: 201, // 201 Created
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error creating blog post" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 posts per page
    const category = searchParams.get("category"); // Optional category filter

    const skip = (page - 1) * limit;

    const whereCondition: any = {
      published: true, // Only fetch published posts
    };

    if (category) {
      whereCondition.category = {
        equals: category,
        mode: "insensitive", // Optional: case-insensitive category matching
      };
    }

    const blogPosts = await prisma.blogPost.findMany({
      where: whereCondition,
      orderBy: {
        publishedAt: "desc", // Show newest published posts first
      },
      skip: skip,
      take: limit,
      select: {
        // Select only necessary fields for the list view
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        author: true,
        category: true,
        image: true,
        readTime: true,
        publishedAt: true,
        createdAt: true, // For sorting or display if needed
        keywords: true, // Include keywords if needed
      },
    });

    const totalPosts = await prisma.blogPost.count({
      where: whereCondition,
    });

    return new NextResponse(
      JSON.stringify({
        data: blogPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts: totalPosts,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching blog posts" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
