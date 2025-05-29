"use client";
import React, { useEffect, useState } from "react";
// import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, UserIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ReactMarkdown from "react-markdown"; // For rendering Markdown content
import rehypeRaw from "rehype-raw"; // To allow HTML in Markdown (use with caution)
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown (tables, strikethrough, etc.)
import Head from "next/head";

interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  image: string | null;
  readTime: string | null;
  published: boolean;
  publishedAt: string | null; // Or Date
  createdAt: string; // Or Date
  updatedAt: string; // Or Date
  keywords: string[];
}

const BlogPost: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/blog-posts/${slug}`);
          if (response.status === 404) {
            setPost(null); // Explicitly set to null if not found
            toast.error("Blog post not found.");
            // Optionally redirect: router.push('/blog');
            return;
          }
          if (!response.ok) {
            throw new Error("Failed to fetch blog post");
          }
          const data: BlogPostData = await response.json();
          setPost(data);
          document.title = `${data.title} - CoverSumé Blog`;
        } catch (error) {
          console.error("Error fetching blog post:", error);
          toast.error("Could not load the blog post.");
          setPost(null);
        } finally {
          setIsLoading(false);
          window.scrollTo(0, 0);
        }
      };
      fetchPost();
    } else {
      setIsLoading(false); // No slug, nothing to load
    }
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading post...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The blog post you are looking for does not exist or may have been
          moved.
        </p>
        <Button asChild variant="outline">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${post.title} - CoverSumé Blog`}</title>
        <meta name="description" content={post.excerpt} />
        {post.keywords && post.keywords.length > 0 && (
          <meta name="keywords" content={post.keywords.join(", ")} />
        )}
        {/* Add other meta tags like Open Graph, Twitter Cards if needed */}
      </Head>
      <div className="pt-28 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>

            {post.keywords && post.keywords.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Keywords:
                </span>
                {post.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80"
                  >
                    {/* <TagIcon className="h-3 w-3 mr-1" /> Optional icon */}
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {post.image && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-md">
                <Image
                  src={post.image}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8">
              {post.publishedAt && (
                <span className="inline-flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Published on{" "}
                  {new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {post.readTime && (
                <span className="inline-flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" />
                  {post.readTime}
                </span>
              )}
              <span className="inline-flex items-center">
                <UserIcon className="h-4 w-4 mr-1.5" />
                By {post.author}
              </span>
              <span className="inline-flex items-center bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                {post.category}
              </span>
            </div>

            {/* <article className="prose prose-lg max-w-none">
            {post.content.split("\n").map((paragraph, index) => {
              if (paragraph.startsWith("#")) {
                const match = paragraph?.match(/^#+/);
                const level = match ? match[0].length : 0;
                const text = paragraph.replace(/^#+\s/, "");
                const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements; // Type assertion
                return (
                  <HeadingTag key={index} className="font-bold">
                    {text}
                  </HeadingTag>
                );
              }
              if (paragraph.startsWith("-")) {
                return <li key={index}>{paragraph.substring(2)}</li>;
              }
              if (paragraph.trim() === "") {
                return <br key={index} />;
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </article> */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {/* Using ReactMarkdown to render content */}
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]} // Allows HTML if present in your markdown
                remarkPlugins={[remarkGfm]} // For GitHub Flavored Markdown features
              >
                {post.content}
              </ReactMarkdown>
            </article>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Share this article</h3>
              <div className="flex space-x-4">
                {/* Replace with actual sharing links/buttons */}
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
