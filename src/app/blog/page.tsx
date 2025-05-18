"use client";
import React, { useEffect } from "react";
// import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "How to Write a Cover Letter That Gets You Noticed",
    excerpt:
      "Learn the key elements of a successful cover letter and how to make yours stand out from the competition.",
    author: "Sarah Johnson",
    date: "March 15, 2025",
    readTime: "5 min read",
    category: "Writing Tips",
    image:
      "https://images.pexels.com/photos/3759098/pexels-photo-3759098.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
  {
    id: 2,
    title: "The Future of Job Applications: AI and Automation",
    excerpt:
      "Discover how artificial intelligence is transforming the job application process and what it means for job seekers.",
    author: "Michael Chen",
    date: "March 10, 2025",
    readTime: "7 min read",
    category: "Industry Trends",
    image:
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
  {
    id: 3,
    title: "5 Common Cover Letter Mistakes to Avoid",
    excerpt:
      "Don't let these common errors hurt your chances of landing an interview. Learn what not to do in your cover letter.",
    author: "Emily Rodriguez",
    date: "March 5, 2025",
    readTime: "4 min read",
    category: "Writing Tips",
    image:
      "https://images.pexels.com/photos/4240505/pexels-photo-4240505.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
];

const Blog: React.FC = () => {
  useEffect(() => {
    document.title = "Blog - CoverGen";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">CoverSumé Blog</h1>
          <p className="text-lg text-gray-600">
            Expert advice and insights on cover letters, job hunting, and career
            development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="card overflow-hidden transition-all hover:shadow-lg"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span className="inline-flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/blog/${post.id}`}
                    className="hover:text-primary-600"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">{post.author}</span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-primary-600 hover:text-primary-700 inline-flex items-center text-sm font-medium"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="btn btn-outline">Load More Articles</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
