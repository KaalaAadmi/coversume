"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { Link } from 'react-router-dom';

const PreviewGenerator: React.FC = () => {
  //   const [resumeText, setResumeText] = useState<string>("");
  //   const [jobDescription, setJobDescription] = useState<string>("");
  //   const [previewGenerated, setPreviewGenerated] = useState<boolean>(false);

  //   const generatePreview = () => {
  //     // In a real app, this would call an API
  //     // setPreviewGenerated(true);
  //   };
  const [activeTab, setActiveTab] = useState<string>("inputs");
  const onTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <section className="py-16 sm:py-24">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">Try It Out</h2>
          <p className="text-lg text-gray-600">
            See how our AI creates personalized cover letters from your resume
            and job description.
          </p>
        </div>

        <motion.div
          className="max-w-5xl mx-auto card overflow-hidden shadow-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Resume Excerpt
                </label>
                <textarea
                  id="resume"
                  rows={5}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                  placeholder="Paste a portion of your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="job-description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  rows={5}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                  placeholder="Paste part of the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="btn btn-primary px-6 py-2.5"
                onClick={generatePreview}
                disabled={!resumeText || !jobDescription}
              >
                Generate Preview
              </button>
            </div>

            {previewGenerated && (
              <motion.div
                className="mt-8 p-6 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-4">
                  Preview Generated Cover Letter
                </h3>
                <div className="prose max-w-none">
                  <p>Dear Hiring Manager,</p>
                  <p>
                    I am writing to express my strong interest in the [Position]
                    role at [Company] that I discovered through [Source]. With
                    my background in [relevant experience from resume] and
                    proven track record in [key achievement from resume], I am
                    confident in my ability to make significant contributions to
                    your team.
                  </p>
                  <div className="flex justify-center mt-6">
                    <Link
                      href="/register"
                      className="btn btn-secondary inline-flex items-center"
                    >
                      See Full Cover Letter
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div> */}
          <div className="card-shadow max-w-4xl mx-auto p-6 md:p-8">
            <Tabs
              value={activeTab}
              onValueChange={onTabChange}
              defaultValue={"inputs"}
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="inputs">Inputs</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="inputs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume Excerpt
                    </label>
                    <textarea
                      className="min-h-[200px] w-full rounded-lg border border-gray-200 p-3 text-sm"
                      placeholder="Paste a portion of your resume here..."
                      defaultValue="Marketing Specialist at XYZ Corp (2018-2023)
• Increased social media engagement by 45% through strategic content planning
• Led email marketing campaigns resulting in 25% improved conversion rates
• Managed a team of 3 junior marketers and coordinated with sales team"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description Excerpt
                    </label>
                    <textarea
                      className="min-h-[200px] w-full rounded-lg border border-gray-200 p-3 text-sm"
                      placeholder="Paste a portion of the job description here..."
                      defaultValue="We are looking for a Marketing Manager with experience in digital campaigns, team leadership, and cross-department collaboration. The ideal candidate will have a proven track record of improving engagement metrics and driving conversions across multiple channels."
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <button
                    className="btn btn-primary px-8 py-3 text-base"
                    onClick={() => onTabChange("preview")}
                  >
                    {/* <button className="btn btn-outline px-8 py-3 text-base group"> */}
                    Generate Preview
                  </button>
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-medium mb-3">
                    Generated Cover Letter Preview
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    During my five-year tenure as a Marketing Specialist at XYZ
                    Corp, I developed a comprehensive skill set that directly
                    aligns with your Marketing Manager position. By implementing
                    strategic content planning that increased social media
                    engagement by 45% and leading email campaigns that improved
                    conversion rates by 25%, I demonstrated the exact
                    metrics-driven approach mentioned in your job description.
                    Additionally, my experience managing a team of three junior
                    marketers and coordinating cross-departmental initiatives
                    with our sales team has prepared me for the leadership and
                    collaborative aspects you&apos;re seeking in your ideal
                    candidate.
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <Link href="/generator">
                    <button className="btn btn-primary px-8 py-3 text-base gap-2">
                      <span>See Full Cover Letter</span>
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PreviewGenerator;
