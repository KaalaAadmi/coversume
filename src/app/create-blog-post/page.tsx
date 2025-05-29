"use client";
import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
import {
  Card,
  CardContent,
  //   CardDescription,
  //   CardHeader,
  //   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Tag, Image, Upload, ImageIcon, Tags } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  author: z.string().min(2, "Author name must be at least 2 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"), // Changed from 'tag'
  image: z.string().url("Invalid image URL").optional().nullable(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Blog content must be at least 50 characters"),
  readTime: z.string().optional(), // Add readTime if you want to capture it in the form
  keywords: z.string().optional(), // Input as a string, will be split into an array
});

const CreateBlogPost = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      category: "", // Changed from 'tag'
      image: null, // Optional image URL
      title: "",
      excerpt: "",
      content: "",
      readTime: "5 min read", // Example default
      keywords: "", // Input as a string, will be split into an array later
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setSelectedImage(null); // Clear previous selection

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        // Call your new backend endpoint
        method: "POST",
        body: formData, // FormData sets its own Content-Type
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedImage(data.imageUrl); // Store the Cloudinary URL
        // Optionally, if 'image' is a form field you want to validate with react-hook-form:
        // form.setValue("image", data.imageUrl, { shouldValidate: true });
        toast.success("Image uploaded successfully!");
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to upload image." }));
        toast.error(errorData.message || "Failed to upload image.");
        console.error("Image Upload API Error:", errorData);
      }
    } catch (error) {
      console.error("Image upload submission error:", error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      setIsUploadingImage(false);
      // Reset file input to allow re-uploading the same file if needed
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // If image is mandatory and not selected, show an error
    // This check depends on how you define 'image' in your formSchema (optional or required)
    // For example, if formSchema.image is not optional:
    // if (!selectedImage && !formSchema.shape.image.isOptional()) {
    //   toast.error("Please upload a featured image.");
    //   return;
    // }

    setIsSubmitting(true);
    try {
      const keywordsArray = values.keywords
        ? values.keywords
            .split(",")
            .map((kw) => kw.trim())
            .filter((kw) => kw.length > 0)
        : [];

      const payload = {
        ...values,
        image: selectedImage, // Send the Cloudinary URL from the state
        keywords: keywordsArray, // Convert string to array
      };

      const response = await fetch("/api/blog-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newPost = await response.json();
        toast.success("Blog post created successfully!");
        router.push(`/blog/${newPost.slug}`);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to create blog post." }));
        toast.error(errorData.message || "Failed to create blog post.");
        console.error("API Error:", errorData);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while creating the post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mt-16">
      {/* <Navbar /> */}
      <section className="bg-gradient-to-tr from-brand-50 to-blue-50 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Create New Blog Post{" "}
          </h1>
          <p className="text-xl text-gray-600">
            Share your cover letter expertise and insights with our community
          </p>
        </div>
      </section>
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            {/* <CardHeader>
              <CardTitle className="text-2xl">Create New Blog Post</CardTitle>
              <CardDescription>
                Share your cover letter expertise and insights with our
                community
              </CardDescription>
            </CardHeader> */}
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User size={16} />
                            Author Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Tag size={16} />
                            Category Tag
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Tips & Tricks, Templates"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Tags size={16} /> {/* Icon for keywords */}
                          Keywords (comma-separated)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., cover letter tips, job search, resume"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter relevant keywords separated by commas.
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a descriptive title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief summary of your post (shown in list view)"
                            className="resize-none h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="readTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          {/* <Clock size={16} /> Optional icon */}
                          Read Time
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5 min read" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon size={16} /> {/* Aliased import */}
                      Featured Image
                    </Label>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-center border-2 border-dashed rounded-lg border-gray-300 p-6 bg-gray-50">
                        {isUploadingImage ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">
                              Uploading image...
                            </p>
                          </div>
                        ) : selectedImage ? (
                          <div className="relative w-full">
                            <img
                              src={selectedImage} // This is now the Cloudinary URL
                              alt="Preview"
                              className="mx-auto max-h-64 rounded-lg object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setSelectedImage(null)}
                              type="button"
                              disabled={isUploadingImage}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <div className="text-sm text-gray-600 mb-2">
                              Drag and drop an image, or click to browse
                            </div>
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() =>
                                document.getElementById("image-upload")?.click()
                              }
                              disabled={isUploadingImage}
                            >
                              Upload Image
                            </Button>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={isUploadingImage}
                            />
                          </div>
                        )}
                      </div>
                      {/* Optional: Display form error for image if using react-hook-form validation for it */}
                      {/* <FormMessage>{form.formState.errors.image?.message}</FormMessage> */}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog Content (Markdown)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your blog post using Markdown syntax..."
                            className="min-h-[300px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          Supports Markdown syntax. Use # for headings, * for
                          italic, ** for bold, etc.
                        </p>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => router.push("/blog")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Publish Post</Button>
                    {/* <button className="btn btn-outline px-8 py-3 text-base group">
                      Cancel
                    </button>
                    <button className="btn btn-primary px-8 py-3 text-base group">
                      Publish Post
                    </button> */}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default CreateBlogPost;
