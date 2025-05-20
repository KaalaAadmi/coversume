"use client";
import React, { useEffect } from "react";
// import { Link } from 'react-router-dom';
import { FileQuestion } from "lucide-react";
import Link from "next/link";

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = "Page Not Found - CoverSumé";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32">
      <div className="text-center">
        <FileQuestion className="h-20 w-20 text-primary-500 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-700 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary inline-flex">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
