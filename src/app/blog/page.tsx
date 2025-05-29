"use client";
import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BlogPostPreview {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  image: string | null;
  readTime: string | null;
  publishedAt: string | null; // Or Date
  createdAt: string; // Or Date
  keywords: string[];
}

interface BlogPostsResponse {
  data: BlogPostPreview[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = "Blog - CoverSumé";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBlogPosts = async (page: number) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/blog-posts?page=${page}&limit=9`); // Fetch 9 posts per page
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data: BlogPostsResponse = await response.json();
        setBlogPosts((prevPosts) =>
          page === 1 ? data.data : [...prevPosts, ...data.data]
        );
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        toast.error("Could not load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts(currentPage);
  }, [currentPage]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">CoverSumé Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Expert advice and insights on cover letters, job hunting, and career
            development
          </p>
        </div>

        {isLoading && blogPosts.length === 0 ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading articles...
            </p>
          </div>
        ) : blogPosts.length === 0 && !isLoading ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              No blog posts found.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Check back later for new articles!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="card bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl flex flex-col"
              >
                {post.image && (
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative w-full h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    {post.publishedAt && (
                      <span className="inline-flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="inline-flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold mb-2 text-foreground">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-muted-foreground mb-4 text-sm flex-grow">
                    {post.excerpt}
                  </p>

                  {post.keywords && post.keywords.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">
                          {post.author}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {currentPage < totalPages && !isLoading && (
          <div className="mt-12 text-center">
            <Button onClick={handleLoadMore} variant="outline">
              Load More Articles
            </Button>
          </div>
        )}
        {isLoading && blogPosts.length > 0 && (
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
