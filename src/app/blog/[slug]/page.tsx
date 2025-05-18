"use client";
import React, { useEffect } from "react";
// import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

// This would typically come from an API or database
const blogPosts = {
  1: {
    title: "How to Write a Cover Letter That Gets You Noticed",
    content: `
# How to Write a Cover Letter That Gets You Noticed

A well-crafted cover letter can be the difference between landing your dream job and getting lost in a sea of applications. In this comprehensive guide, we'll walk you through the essential elements of writing a compelling cover letter that will catch the attention of hiring managers.

## Start with a Strong Opening

Your opening paragraph should immediately grab the reader's attention and clearly state which position you're applying for. Mention where you found the job posting and briefly explain why you're excited about the opportunity.

## Highlight Relevant Experience

In the body paragraphs, focus on your most relevant experiences and achievements. Use specific examples to demonstrate how your skills align with the job requirements. Remember to:

- Use concrete numbers and metrics when possible
- Focus on achievements rather than just responsibilities
- Connect your experience directly to the company's needs

## Show Company Knowledge

Demonstrate that you've done your research by mentioning specific things about the company that appeal to you. This could include:

- Recent company achievements or news
- Company culture and values
- Specific projects or initiatives

## End with a Strong Call to Action

Your closing paragraph should:
- Reiterate your interest in the position
- Thank the reader for their time
- Include a clear call to action
- Provide your contact information

## Professional Formatting

Always maintain professional formatting:
- Use a clean, readable font
- Include proper spacing
- Keep it to one page
- Use consistent margins

Remember, your cover letter is often your first impression on a potential employer. Make it count by being concise, specific, and professional.
    `,
    author: "Sarah Johnson",
    date: "March 15, 2025",
    readTime: "5 min read",
    category: "Writing Tips",
    image:
      "https://images.pexels.com/photos/3759098/pexels-photo-3759098.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
  2: {
    title: "The Future of Job Applications: AI and Automation",
    content: `
# The Future of Job Applications: AI and Automation

Artificial Intelligence is revolutionizing the way we apply for jobs and how companies handle recruitment. This article explores the current trends and future predictions for AI in the job application process.

## The Rise of AI in Recruitment

Artificial Intelligence is transforming recruitment in several ways:

- Resume screening automation
- Predictive analytics for candidate success
- Automated initial interviews
- Personalized job recommendations

## Benefits of AI-Powered Applications

The integration of AI into the job application process brings numerous benefits:

### For Job Seekers:
- More personalized job recommendations
- Faster application processes
- Better feedback on applications
- Improved matching with suitable positions

### For Employers:
- Reduced time-to-hire
- Lower recruitment costs
- Better candidate matching
- Reduced bias in hiring

## Challenges and Considerations

While AI brings many benefits, there are also challenges to consider:

- Potential for algorithmic bias
- Privacy concerns
- The need for human oversight
- Technical limitations

## Preparing for the Future

To succeed in an AI-driven job market, candidates should:

1. Optimize their resumes for ATS systems
2. Develop digital interview skills
3. Understand AI-powered application platforms
4. Focus on unique human qualities

## The Human Element

Despite automation, human interaction remains crucial in hiring. The best approaches combine AI efficiency with human judgment.
    `,
    author: "Michael Chen",
    date: "March 10, 2025",
    readTime: "7 min read",
    category: "Industry Trends",
    image:
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
  3: {
    title: "5 Common Cover Letter Mistakes to Avoid",
    content: `
# 5 Common Cover Letter Mistakes to Avoid

Even the most qualified candidates can hurt their chances of landing an interview with a poorly written cover letter. Here are the five most common mistakes to avoid.

## 1. Generic, One-Size-Fits-All Approach

The biggest mistake is using the same cover letter for every application. Each letter should be:

- Tailored to the specific job
- Customized for the company
- Aligned with the job requirements

## 2. Focusing Too Much on Yourself

While a cover letter is about you, it should focus on what you can offer the employer:

- Highlight relevant skills
- Demonstrate value
- Show how you can solve their problems

## 3. Poor Opening and Closing

Many candidates start and end their cover letters weakly:

### Common Opening Mistakes:
- "To Whom It May Concern"
- "Dear Sir/Madam"
- Generic introductions

### Common Closing Mistakes:
- Weak call to action
- No follow-up plan
- Missing contact information

## 4. Length and Formatting Issues

Keep your cover letter professional and readable:

- Stick to one page
- Use consistent formatting
- Include proper spacing
- Choose a professional font

## 5. Grammar and Spelling Errors

Nothing undermines your professionalism faster than:

- Typos
- Grammar mistakes
- Punctuation errors
- Inconsistent capitalization

## How to Avoid These Mistakes

Follow these best practices:

1. Customize each letter
2. Proofread carefully
3. Get feedback from others
4. Use professional formatting
5. Focus on the employer's needs
    `,
    author: "Emily Rodriguez",
    date: "March 5, 2025",
    readTime: "4 min read",
    category: "Writing Tips",
    image:
      "https://images.pexels.com/photos/4240505/pexels-photo-4240505.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post =
    slug && Number(slug) in blogPosts
      ? blogPosts[Number(slug) as keyof typeof blogPosts]
      : null;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - CoverSumé Blog`;
      window.scrollTo(0, 0);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="pt-28 pb-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
            <Link
              href="/blog"
              className="text-primary-600 hover:text-primary-700"
            >
              Return to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-2xl mb-8"
          />

          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
            <span className="inline-flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {post.date}
            </span>
            <span className="inline-flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </span>
            <span className="inline-flex items-center">
              <User className="h-4 w-4 mr-1" />
              {post.author}
            </span>
          </div>

          <article className="prose prose-lg max-w-none">
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
          </article>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button className="btn btn-outline py-2 px-4">Twitter</button>
              <button className="btn btn-outline py-2 px-4">LinkedIn</button>
              <button className="btn btn-outline py-2 px-4">Facebook</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
