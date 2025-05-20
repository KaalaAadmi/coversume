"use client";
import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Edit,
  Trash2,
  ArrowRight,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";

interface SavedLetter {
  id: number;
  company: string;
  position: string;
  date: string;
  content: string;
}

const SavedLettersPage: React.FC = () => {
  const [letters, setLetters] = useState<SavedLetter[]>([
    {
      id: 1,
      company: "Acme Inc.",
      position: "Software Developer",
      date: "May 15, 2025",
      content:
        "# John Doe\n123 Main Street | City, State | (123) 456-7890 | john.doe@email.com\n\nDear Hiring Manager...",
    },
    {
      id: 2,
      company: "TechCorp",
      position: "UX Designer",
      date: "May 10, 2025",
      content:
        "# John Doe\n123 Main Street | City, State | (123) 456-7890 | john.doe@email.com\n\nDear Hiring Manager...",
    },
    {
      id: 3,
      company: "StartupXYZ",
      position: "Product Manager",
      date: "April 28, 2025",
      content:
        "# John Doe\n123 Main Street | City, State | (123) 456-7890 | john.doe@email.com\n\nDear Hiring Manager...",
    },
    {
      id: 4,
      company: "Global Industries",
      position: "Marketing Specialist",
      date: "April 15, 2025",
      content:
        "# John Doe\n123 Main Street | City, State | (123) 456-7890 | john.doe@email.com\n\nDear Hiring Manager...",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredLetters, setFilteredLetters] =
    useState<SavedLetter[]>(letters);

  useEffect(() => {
    document.title = "Saved Letters - CoverSumé";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setFilteredLetters(
      letters.filter(
        (letter) =>
          letter.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, letters]);

  const handleDelete = (id: number) => {
    setLetters(letters.filter((letter) => letter.id !== id));
  };

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Saved Cover Letters
            </h1>
            <p className="text-gray-600">
              Access and manage all your previously generated cover letters
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/generator"
              className="btn btn-primary inline-flex items-center"
            >
              <FileText className="mr-2 h-5 w-5" />
              Create New Letter
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div
          className="card p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by company or position..."
              className="pl-10 pr-4 py-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Letters List */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {filteredLetters.length > 0 ? (
            <div className="overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 sm:gap-x-6 bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="sm:col-span-5">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Position
                  </span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </span>
                </div>
                <div className="sm:col-span-4 text-right">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredLetters.map((letter) => (
                  <div
                    key={letter.id}
                    className="grid sm:grid-cols-12 sm:gap-x-6 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center sm:col-span-5">
                      <div className="p-2 bg-blue-100 rounded-lg mr-4 hidden sm:block">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {letter.company}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {letter.position}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center mt-2 sm:mt-0">
                      <span className="text-gray-500 text-sm">
                        {letter.date}
                      </span>
                    </div>
                    <div className="sm:col-span-4 flex justify-start sm:justify-end items-center space-x-2 mt-3 sm:mt-0">
                      <button
                        className="btn btn-outline py-1 px-2.5"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-outline py-1 px-2.5"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-outline py-1 px-2.5 text-red-600 hover:text-red-700 hover:border-red-300"
                        title="Delete"
                        onClick={() => handleDelete(letter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/generator?load=${letter.id}`}
                        className="btn btn-primary py-1 px-2.5"
                        title="View"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 px-6 text-center">
              {searchTerm ? (
                <div>
                  <p className="text-gray-500 mb-4">
                    No letters match your search.
                  </p>
                  <button
                    className="text-primary-600 hover:text-primary-700"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div>
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No cover letters yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You haven&apos;t created any cover letters yet. Get started
                    by creating your first one.
                  </p>
                  <Link href="/generator" className="btn btn-primary">
                    Create Cover Letter
                  </Link>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SavedLettersPage;
