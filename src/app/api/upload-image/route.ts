import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
// Optional: import { auth } from "@/lib/auth/auth"; // If you want to protect this route

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: NextRequest) {
  // Optional: Protect this route, e.g., ensure user is authenticated
  // const session = await auth.getSession(req);
  // if (!session?.user) {
  //   return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  // }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse(
        JSON.stringify({ message: "No file provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert file to buffer to upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "coversume_blog_posts", // Optional: specify a folder in Cloudinary
          resource_type: "auto", // Let Cloudinary auto-detect
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const result = uploadResponse as {
      secure_url?: string;
      public_id?: string;
    };

    if (!result || !result.secure_url) {
      console.error(
        "Cloudinary upload failed or did not return a secure_url",
        result
      );
      throw new Error("Cloudinary upload failed.");
    }

    return new NextResponse(
      JSON.stringify({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        publicId: result.public_id, // Optional: store if you need to delete/manage later
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Internal server error during image upload.";
    return new NextResponse(
      JSON.stringify({ message: "Error uploading image", error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
