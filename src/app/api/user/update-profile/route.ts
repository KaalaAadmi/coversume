import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/auth-client"; // Your better-auth instance
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().optional().nullable(),
  portfolio: z.string().url("Invalid URL format").optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid data",
          issues: parsed.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { name, phone, portfolio } = parsed.data;

    const updatedUser = await prisma.user.update({
      where: { id: session?.user?.id },
      data: {
        ...(name && { name }), // Only update if provided
        phone: phone, // Allows setting to null or empty string if desired by schema
        portfolioUrl: portfolio, // Prisma field name is portfolioUrl
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        portfolioUrl: true,
        isPro: true,
      }, // Return updated user data
    });

    return new NextResponse(
      JSON.stringify({
        message: "Profile updated successfully",
        user: updatedUser,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error updating profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
