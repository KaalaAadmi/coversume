import React from "react";
import { motion } from "framer-motion";
// import { Link } from 'react-router-dom';
import { Play, FileText } from "lucide-react";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-gradient-to-tl from-primary-50 to-secondary-50 opacity-20 shadow-xl shadow-secondary-600/10 ring-1 ring-primary-50"></div>
      </div>

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="gradient-text">AI-Powered, Harvard-Style</span>
            <br />
            Cover Letters in Seconds
          </motion.h1>

          <motion.p
            className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Upload your resume and job description — we&apos;ll handle the rest.
            Create tailored cover letters that get you noticed by hiring
            managers.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/generator"
              className="btn btn-primary px-8 py-3 text-base"
            >
              <FileText className="mr-2 h-5 w-5" />
              Try It Free
            </Link>
            <button className="btn btn-outline px-8 py-3 text-base group">
              <Play className="mr-2 h-5 w-5 text-primary-600 group-hover:text-primary-700" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Laptop mockup */}
        <motion.div
          className="mt-16 sm:mt-24 relative mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {/* Laptop frame */}
              <div className="bg-gray-800 h-8 flex items-center px-4 rounded-t-2xl">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              {/* App screenshot */}
              <div className="bg-white p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      Resume
                    </div>
                    <div className="h-48 bg-gray-100 rounded-lg"></div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      Job Description
                    </div>
                    <div className="h-48 bg-gray-100 rounded-lg"></div>
                  </div>
                </div>
                <div className="mt-6 p-4 border border-gray-200 rounded-xl">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Generated Cover Letter
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
