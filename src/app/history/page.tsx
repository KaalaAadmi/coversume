"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Edit,
  Trash2,
  ArrowRight,
  SearchIcon, // Using your existing import
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth/auth-client"; // Assuming this is your session hook
import { Button } from "@/components/ui/button"; // Assuming you have this
import { useDebounce } from "@/hooks/useDebounce"; // Assuming you have this hook
import { toast } from "sonner";

// Updated interface to match API response and usage
interface SavedLetter {
  id: string; // Changed from number
  company: string;
  position: string;
  date: string; // Will be ISO string from API
  // content: string; // Removed, not fetched in list view
  versionCount: number; // Added
}

interface HistoryApiResponse {
  letters: SavedLetter[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Make sure useDebounce hook is defined (e.g., in src/hooks/useDebounce.ts)
// export function useDebounce<T>(value: T, delay?: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
//     return () => { clearTimeout(timer); };
//   }, [value, delay]);
//   return debouncedValue;
// }

const SavedLettersPage: React.FC = () => {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [letters, setLetters] = useState<SavedLetter[]>([]); // Initialize as empty
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  // No longer need filteredLetters state, API will handle filtering
  // const [filteredLetters, setFilteredLetters] = useState<SavedLetter[]>(letters);

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce for API calls
  const itemsPerPage = 10; // Or your preferred limit

  const fetchHistoryData = useCallback(
    async (page: number, search: string, currentUserId?: string) => {
      if (!currentUserId) {
        // Check if userId is available
        setIsLoading(false);
        setLetters([]); // Clear letters if no user
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          // Pass userId to the API
          `/api/history-data?userId=${encodeURIComponent(
            currentUserId
          )}&page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(
            search
          )}`
        );
        if (response.ok) {
          const data: HistoryApiResponse = await response.json();
          setLetters(data.letters);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage); // Ensure API returns current page
          setTotalItems(data.totalItems);
        } else {
          console.error("Failed to fetch history data:", await response.text());
          setLetters([]);
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
        setLetters([]);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage] // Removed session from dependencies here, pass userId directly
  );

  useEffect(() => {
    document.title = "Cover Letter History - CoverSumé"; // Updated title
    window.scrollTo(0, 0);
  }, []);

  // useEffect to fetch data when session, currentPage, or debouncedSearchTerm changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchHistoryData(currentPage, debouncedSearchTerm, session.user.id);
    } else if (!isSessionLoading && !session?.user?.id) {
      // If session is loaded but no user, clear data and stop loading
      setLetters([]);
      setIsLoading(false);
      setTotalPages(1);
      setCurrentPage(1);
      setTotalItems(0);
    }
  }, [
    session,
    isSessionLoading,
    currentPage,
    debouncedSearchTerm,
    fetchHistoryData,
  ]);

  // Remove the client-side filtering useEffect
  // useEffect(() => {
  //   setFilteredLetters(
  //     letters.filter(
  //       (letter) =>
  //         letter.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         letter.position.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   );
  // }, [searchTerm, letters]);

  const handleDelete = async (id: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to delete letters.");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this cover letter and all its versions?"
    );
    if (confirmed) {
      console.log("Attempting to delete letter with ID:", id);
      try {
        const response = await fetch(
          `/api/cover-letter/${id}?userId=${session?.user?.id}`,
          {
            // Removed userId from query, session handles it
            method: "DELETE",
            headers: {
              // Include authorization headers if your auth.getSession(req) in API needs it
              // e.g., 'Authorization': `Bearer ${session.accessToken}` if applicable
            },
          }
        );
        if (response.ok) {
          toast.success("Letter deleted successfully");
          fetchHistoryData(currentPage, debouncedSearchTerm, session.user.id); // Refetch
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to delete letter." }));
          toast.error(errorData.message || "Failed to delete letter.");
        }
      } catch (error) {
        console.error("Error deleting letter:", error);
        toast.error("An error occurred while deleting the letter.");
      }
    }
  };

  const formatDateForDisplay = (isoDateString: string) => {
    if (!isoDateString) return "N/A";
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search term
  };

  if (isSessionLoading && !session?.user?.id) {
    // Show loader if session is loading and no user yet
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Cover Letter History
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
              className="pl-10 pr-4 py-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" // Your existing class
              value={searchTerm}
              onChange={handleSearchChange} // Use new handler
            />
          </div>
        </motion.div>

        {isLoading && letters.length === 0 ? (
          // Show loader when actively loading and no letters yet
          <div className="card py-8 px-6 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600 mx-auto" />
            <p className="mt-2 text-gray-500">Loading history...</p>
          </div>
        ) : !isLoading && letters.length === 0 ? (
          <div className="card py-8 px-6 text-center">
            {debouncedSearchTerm ? (
              // Check debouncedSearchTerm for "no results"
              <div>
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No letters match your search for &quot;{debouncedSearchTerm}
                  &quot;.
                </p>
                <button
                  className="text-primary-600 hover:text-primary-700"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
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
                  You haven&apos;t created any cover letters yet. Get started by
                  creating your first one.
                </p>
                <Link href="/generator" className="btn btn-primary">
                  Create Cover Letter
                </Link>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="overflow-x-auto">
              <div className="hidden sm:grid sm:grid-cols-12 sm:gap-x-6 bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="sm:col-span-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Position
                  </span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </span>
                </div>
                <div className="sm:col-span-2 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versions
                  </span>
                </div>
                <div className="sm:col-span-3 text-right">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {letters.map((letter) => (
                  <div
                    key={letter.id}
                    className="grid grid-cols-1 sm:grid-cols-12 sm:gap-x-6 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center sm:col-span-4">
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
                        {formatDateForDisplay(letter.date)}
                      </span>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-center mt-2 sm:mt-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Layers className="h-3 w-3 mr-1" />
                        {letter.versionCount}
                      </span>
                    </div>
                    <div className="sm:col-span-3 flex flex-wrap justify-start sm:justify-end items-center space-x-2 mt-3 sm:mt-0">
                      {/* TODO: Add download button */}
                      {/* <Button
                        variant="outline"
                        size="sm"
                        className="py-1 px-2.5"
                        title="Download (Not Implemented)"
                        disabled
                      >
                        <Download className="h-4 w-4" />
                      </Button> */}
                      {/* TODO: Add edit button */}
                      {/* <Button
                        variant="outline"
                        size="sm"
                        className="py-1 px-2.5"
                        title="Edit Latest Version"
                        asChild
                      >
                        <Link href={`/generator?rootId=${letter.id}`}>
                          {" "}
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button> */}
                      {/* TODO: add delete functionality */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="py-1 px-2.5 text-red-600 hover:text-red-700 hover:border-red-300"
                        title="Delete"
                        onClick={() => handleDelete(letter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Link
                        href={`/history/${letter.id}`} // Points to the new viewer page
                        className="btn btn-primary py-1 px-2.5"
                        title="View Letter"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages} ({totalItems} items)
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedLettersPage;
