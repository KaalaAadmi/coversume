"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Clipboard,
  FileDown,
  Sparkles,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const GeneratorPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [letterFeedback, setLetterFeedback] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Generate Cover Letter - CoverGen";
    window.scrollTo(0, 0);
  }, []);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setResumeText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);

    // Simulate API call to generate cover letter
    setTimeout(() => {
      const mockGeneratedLetter = `# John Doe
123 Main Street | City, State | (123) 456-7890 | john.doe@email.com | portfoliosite.com

${new Date().toLocaleDateString()}

Hiring Manager
Company Name
Company Address
City, State ZIP

Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at TechCorp as advertised on your company website. With my background in full-stack development and proven track record of delivering scalable software solutions, I am confident in my ability to make significant contributions to your team.

Throughout my career, I have developed expertise in JavaScript, React, and Node.js, which aligns perfectly with the technical requirements outlined in your job description. In my current role as a Senior Developer at CurrentCompany, I successfully led the development of a customer-facing portal that improved user engagement by 35% and reduced support tickets by 50%. This achievement demonstrates my ability to create effective solutions that positively impact both users and business metrics.

I am particularly drawn to TechCorp's mission to make technology accessible to underserved communities. Your recent initiative to provide coding education to rural schools resonates with my personal commitment to expanding opportunities in the tech sector. I believe my experience mentoring junior developers and contributing to open-source projects would allow me to further your company's goals.

I am excited about the possibility of bringing my technical expertise, leadership experience, and passion for innovation to TechCorp. I would welcome the opportunity to discuss how my background and skills would be an asset to your team. Thank you for considering my application, and I look forward to speaking with you soon.

Sincerely,

John Doe`;

      setGeneratedLetter(mockGeneratedLetter);
      setIsLoading(false);
      setStep(2);
    }, 2000);
  };

  const handleRefinement = (refinementType: string) => {
    setLetterFeedback(
      `Letter will be refined to be ${refinementType.toLowerCase()}`
    );

    // In a real app, this would call an API to refine the letter
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Cover Letter Generator
          </h1>
          <p className="text-gray-600">
            Create a personalized, Harvard-style cover letter in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <motion.div
            className={`lg:col-span-1 ${step === 2 ? "hidden lg:block" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Input Information</h2>

              {/* Resume Upload */}
              <div className="mb-6">
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Resume
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    id="resume"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={handleResumeUpload}
                  />
                  <label
                    htmlFor="resume"
                    className="cursor-pointer flex flex-col items-center justify-center py-4"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-gray-600 font-medium">
                      Upload Resume
                    </span>
                    <span className="text-gray-500 text-sm mt-1">
                      PDF, DOCX, or TXT
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Or paste your resume text below:
                </p>
                <textarea
                  id="resume-text"
                  rows={5}
                  className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                ></textarea>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <label
                  htmlFor="job-description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  rows={5}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Language Selection */}
              <div className="mb-6">
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Language
                </label>
                <select
                  id="language"
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Information
                  </label>
                </div>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Portfolio URL (optional)"
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary w-full justify-center py-3"
                onClick={handleSubmit}
                disabled={isLoading || !resumeText || !jobDescription}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Center Column - Generated Letter Preview */}
          <motion.div
            className={`${step === 1 ? "lg:col-span-2" : "lg:col-span-2"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="card h-full">
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {step === 1 ? "Preview" : "Generated Cover Letter"}
                </h2>
                {step === 2 && (
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-outline py-1 px-3"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLetter);
                      }}
                    >
                      <Clipboard className="h-4 w-4 mr-1" />
                      Copy
                    </button>
                    <button className="btn btn-outline py-1 px-3">
                      <FileDown className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 h-[calc(100vh-300px)] overflow-y-auto bg-gray-50">
                {step === 1 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    {resumeText && jobDescription ? (
                      <div>
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Ready to Generate
                        </h3>
                        <p className="text-gray-600 max-w-md">
                          Your resume and job description are ready. Click
                          &ldquo;Generate Cover Letter&rdquo; to create your
                          personalized letter.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Preview Available
                        </h3>
                        <p className="text-gray-600 max-w-md">
                          Please upload your resume and paste the job
                          description to generate a personalized cover letter.
                        </p>
                      </div>
                    )}
                  </div>
                ) : isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {letterFeedback
                        ? "Refining Letter..."
                        : "Generating Cover Letter..."}
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      {letterFeedback
                        ? letterFeedback
                        : "Our AI is creating your personalized cover letter based on your resume and the job description."}
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-blue max-w-none">
                    <ReactMarkdown>{generatedLetter}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Refinement Panel (Only visible in step 2) */}
          {step === 2 && (
            <motion.div
              className="lg:col-span-3 xl:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Refine Your Letter
                </h2>

                <div className="space-y-4 mb-8">
                  <button
                    className="btn btn-outline w-full justify-start py-2.5 text-left"
                    onClick={() => handleRefinement("More Concise")}
                  >
                    <RefreshCw className="h-5 w-5 mr-3 text-blue-600" />
                    Make it more concise
                  </button>
                  <button
                    className="btn btn-outline w-full justify-start py-2.5 text-left"
                    onClick={() => handleRefinement("More Formal")}
                  >
                    <RefreshCw className="h-5 w-5 mr-3 text-purple-600" />
                    More formal tone
                  </button>
                  <button
                    className="btn btn-outline w-full justify-start py-2.5 text-left"
                    onClick={() => handleRefinement("More Confident")}
                  >
                    <RefreshCw className="h-5 w-5 mr-3 text-teal-600" />
                    More confident language
                  </button>
                  <button
                    className="btn btn-outline w-full justify-start py-2.5 text-left"
                    onClick={() => handleRefinement("More Achievement-Focused")}
                  >
                    <RefreshCw className="h-5 w-5 mr-3 text-amber-600" />
                    Emphasize achievements
                  </button>
                </div>

                <div className="mt-8">
                  <h3 className="text-md font-medium mb-3">Rate This Letter</h3>
                  <div className="flex space-x-2">
                    <button className="btn btn-outline py-2 flex-1">
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      It&apos;s Great
                    </button>
                    <button className="btn btn-outline py-2 flex-1">
                      <ThumbsDown className="h-5 w-5 mr-2" />
                      Needs Work
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button className="btn btn-primary w-full justify-center py-2.5">
                    Save Cover Letter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
