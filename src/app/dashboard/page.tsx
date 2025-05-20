"use client";
// "use server";
import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  PlusCircle,
  ChevronRight,
  Briefcase,
} from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useSession } from "@/lib/auth/auth-client";
// import { headers } from "next/headers";
// import { auth } from "@/lib/auth/auth";
// import { redirect } from "next/navigation";
// import { getSession } from "@/lib/session";

const DashboardPage: React.FC = () => {
  // const { user } = useAuth();
  // console.log("SESSION:", session);
  // useEffect(() => {
  //   document.title = "Dashboard - CoverSumé";
  //   window.scrollTo(0, 0);
  // }, []);
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = useSession();
  console.log(session, "dashboard session");
  // Mock data for recent letters
  const recentLetters = [
    {
      id: 1,
      company: "Acme Inc.",
      position: "Software Developer",
      date: "2 days ago",
    },
    { id: 2, company: "TechCorp", position: "UX Designer", date: "1 week ago" },
    {
      id: 3,
      company: "StartupXYZ",
      position: "Product Manager",
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="bg-gradient-to-tr from-brand-50 to-blue-50 mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {session?.user?.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-600">
            Create personalized cover letters and track your job applications
          </p>
        </div>

        {/* Main Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Letters</p>
                <p className="text-3xl font-bold mt-1">
                  {session?.user?.isPro ? "Unlimited" : "5 / month"}{" "}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {!session?.user?.isPro && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/pricing"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                >
                  Upgrade to Pro
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">Recent Letters</p>
                <p className="text-3xl font-bold mt-1">
                  {recentLetters.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/history"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
              >
                View All Letters
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="card p-6 bg-gradient-to-br from-primary-500 to-secondary-600 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm">Create New</p>
                <p className="text-2xl font-bold mt-1">Cover Letter</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <Link
                href="/generator"
                className="text-white hover:text-white/80 text-sm font-medium inline-flex items-center"
              >
                Start Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Cover Letters */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Cover Letters</h2>
            <Link
              href="/history"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {recentLetters.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{letter.company}</h3>
                      <p className="text-gray-500 text-sm">{letter.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 text-sm mr-4">
                      {letter.date}
                    </span>
                    <button className="text-gray-400 hover:text-gray-500">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">
                No cover letters yet. Create your first one!
              </p>
              <Link href="/generator" className="btn btn-primary mt-4">
                Create Cover Letter
              </Link>
            </div>
          )}
        </motion.div>

        {/* Application Tracker (Pro Feature) */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Application Tracker</h2>
              {!session?.user?.isPro && (
                <span className="ml-3 px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  Pro
                </span>
              )}
            </div>
          </div>

          {session?.user?.isPro ? (
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">TechCorp</h3>
                    <p className="text-gray-500 text-sm">Software Engineer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Interview
                  </span>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">StartupXYZ</h3>
                    <p className="text-gray-500 text-sm">Product Designer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Applied
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 mb-4">
                Track your job applications with our Application Tracker.
                Upgrade to Pro to access this feature.
              </p>
              <Link href="/pricing" className="btn btn-primary">
                Upgrade to Pro
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
