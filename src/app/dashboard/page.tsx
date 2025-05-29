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
  Loader2,
  Layers,
} from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useSession } from "@/lib/auth/auth-client";
// import { headers } from "next/headers";
// import { auth } from "@/lib/auth/auth";
// import { redirect } from "next/navigation";
// import { getSession } from "@/lib/session";

interface RecentLetter {
  id: string;
  currentCompany: string | null;
  currentJobRole: string | null;
  updatedAt: string; // Assuming ISO string from backend
  versionCount: number; // Number of versions for this letter
}

interface DashboardData {
  recentLetters: RecentLetter[];
  userData?: { isPro: boolean; coverLetterCountPerMonth: number }; // If fetching fresh user data
}

const MONTHLY_FREE_LIMIT = process.env.NEXT_PUBLIC_MONTHLY_FREE_LIMIT
  ? Number(process.env.NEXT_PUBLIC_MONTHLY_FREE_LIMIT)
  : 3; // Ensure this is available client-side if used

const DashboardPage: React.FC = () => {
  // const { user } = useAuth();
  // console.log("SESSION:", session);
  // useEffect(() => {
  //   document.title = "Dashboard - CoverSumé";
  //   window.scrollTo(0, 0);
  // }, []);
  const {
    data: session,
    isPending: isSessionLoading, //loading state
    error, //error object
    refetch, //refetch the session
  } = useSession();
  console.log(session, "dashboard session");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Dashboard - CoverSumé";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchDashboardData = async () => {
        setIsLoadingData(true);
        try {
          const response = await fetch(
            `/api/dashboard-data?userId=${session.user.id}`
          );
          if (response.ok) {
            const data: DashboardData = await response.json();
            setDashboardData(data);
          } else {
            console.error("Failed to fetch dashboard data");
            setDashboardData({ recentLetters: [] }); // Set empty on error to avoid breaking map
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          setDashboardData({ recentLetters: [] });
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchDashboardData();
    } else if (!isSessionLoading) {
      // If session is loaded and there's no user, stop loading
      setIsLoadingData(false);
    }
  }, [session, isSessionLoading]);

  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return "Good morning";
  //   if (hour < 18) return "Good afternoon";
  //   return "Good evening";
  // };

  const availableLettersText = () => {
    if (dashboardData?.userData?.isPro) return "Unlimited";
    // Assuming coverLetterCountPerMonth is available in session via better-auth config
    const count = dashboardData?.userData?.coverLetterCountPerMonth ?? 0;
    const remaining = MONTHLY_FREE_LIMIT - count;
    return `${remaining < 0 ? 0 : remaining} / ${MONTHLY_FREE_LIMIT} left`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isSessionLoading || (isLoadingData && !dashboardData)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

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
                <p className="text-gray-500 text-sm">
                  Available Letters This Month
                </p>
                <p className="text-3xl font-bold mt-1">
                  {availableLettersText()}{" "}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {!dashboardData?.userData?.isPro && (
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
                  {dashboardData?.recentLetters?.length ?? 0}
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
            {/* <div className="sm:col-span-2 text-center">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Versions
              </span>
            </div> */}
            {dashboardData && dashboardData.recentLetters.length > 0 && (
              <Link
                href="/history"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            )}
          </div>

          {isLoadingData && !dashboardData?.recentLetters?.length ? (
            <div className="px-6 py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
              <p className="text-gray-500 mt-2">Loading recent letters...</p>
            </div>
          ) : dashboardData && dashboardData.recentLetters.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {dashboardData.recentLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {letter.currentCompany || "N/A"}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {letter.currentJobRole || "N/A"}
                      </p>
                    </div>
                  </div>
                  {/* <div className="sm:col-span-2 flex items-center justify-center mt-2 sm:mt-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Layers className="h-3 w-3 mr-1" />
                      {letter.versionCount}
                    </span>
                  </div> */}
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm">
                      {formatDate(letter.updatedAt)}
                    </span>
                    <Link href={`/history/${letter.id}`}>
                      {" "}
                      {/* Or your view/edit page */}
                      <button className="text-primary-600 hover:text-primary-700">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No cover letters generated yet.</p>
              <Link href="/generator" className="btn btn-primary mt-4">
                Create Your First Letter
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
              {!dashboardData?.userData?.isPro && (
                <span className="ml-3 px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  Pro
                </span>
              )}
            </div>
          </div>
          {/* TODO: Application Tracker */}
          {/* {session?.user?.isPro ? (
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
          )} */}
          {dashboardData?.userData?.isPro ? (
            <div className="divide-y divide-gray-200">
              {/* Placeholder for Pro Application Tracker Content */}
              <div className="px-6 py-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Application tracking coming soon for Pro users!
                </p>
              </div>
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
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
