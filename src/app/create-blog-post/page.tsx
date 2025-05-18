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
import { User, Tag, Image, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  author: z.string().min(2, "Author name must be at least 2 characters"),
  tag: z.string().min(2, "Tag must be at least 2 characters"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Blog content must be at least 50 characters"),
});

const CreateBlogPost = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      tag: "",
      title: "",
      excerpt: "",
      content: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real application, this would send the data to an API
    // Including the selectedImage state value

    console.log({
      ...values,
      image: selectedImage,
      slug: values.title.toLowerCase().replace(/\s+/g, "-"),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });

    toast.success("Blog post created successfully!");
    router.push("/blog");
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
            <CardContent>
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
                      name="tag"
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

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Image size={16} />
                      Featured Image
                    </Label>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-center border-2 border-dashed rounded-lg border-gray-300 p-6 bg-gray-50">
                        {selectedImage ? (
                          <div className="relative w-full">
                            <img
                              src={selectedImage}
                              alt="Preview"
                              className="mx-auto max-h-64 rounded-lg object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setSelectedImage(null)}
                              type="button"
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
                            >
                              Upload Image
                            </Button>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </div>
                        )}
                      </div>
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
