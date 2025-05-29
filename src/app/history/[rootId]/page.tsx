"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth/auth-client";
import {
  Loader2,
  FileText,
  Clipboard,
  Download as DownloadIcon, // Renamed to avoid conflict
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // To handle <br/> tags from your generator
import { jsPDF } from "jspdf";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import { Document, Packer as DocxPacker, Paragraph, TextRun } from "docx"; // Ensure correct import for docx

interface CoverLetterVersion {
  id: string;
  versionNumber: number;
  content: string;
  createdAt: string;
  refinementTypeUsed: string | null;
}

interface CoverLetterRootData {
  id: string;
  currentCompany: string | null;
  currentJobRole: string | null;
  originalDate: string | null; // Assuming this field exists from your generator
  versions: CoverLetterVersion[];
  // Add any other fields from CoverLetterRoot you want to display
}

const CoverLetterViewerPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  const rootId = params.rootId as string;
  const versionIdFromQuery = searchParams.get("versionId");

  const [letterData, setLetterData] = useState<CoverLetterRootData | null>(
    null
  );
  const [selectedVersion, setSelectedVersion] =
    useState<CoverLetterVersion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLetterData = useCallback(
    async (currentRootId: string, currentUserId?: string) => {
      if (!currentUserId || !currentRootId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/cover-letter/${currentRootId}?userId=${encodeURIComponent(
            currentUserId
          )}`
        );
        if (response.ok) {
          const data: CoverLetterRootData = await response.json();
          const modifiedVersions = data.versions.map((version) => ({
            ...version,
            content: version.content.replace(/\n/g, "<br/>"),
          }));

          const modifiedData = { ...data, versions: modifiedVersions };

          setLetterData(modifiedData);
          if (modifiedData.versions && modifiedData.versions.length > 0) {
            // Determine which version to show
            const targetVersion = versionIdFromQuery
              ? modifiedData.versions.find((v) => v.id === versionIdFromQuery)
              : modifiedData.versions[0]; // Default to the latest (first in sorted list)
            setSelectedVersion(targetVersion || modifiedData.versions[0]);
          } else {
            setSelectedVersion(null);
          }
        } else {
          toast.error("Failed to load cover letter.");
          setLetterData(null);
          setSelectedVersion(null);
          if (response.status === 404) router.push("/history"); // Redirect if not found
        }
      } catch (error) {
        toast.error("An error occurred while fetching the letter.");
        console.error("Fetch letter error:", error);
        setLetterData(null);
        setSelectedVersion(null);
      } finally {
        setIsLoading(false);
      }
    },
    [versionIdFromQuery, router]
  );

  useEffect(() => {
    if (session?.user?.id && rootId) {
      fetchLetterData(rootId, session.user.id);
    } else if (!isSessionLoading && (!session?.user?.id || !rootId)) {
      setIsLoading(false);
      // Optionally redirect if no session or rootId after loading
      if (!session?.user?.id) router.push("/login");
      else if (!rootId) router.push("/history");
    }
  }, [session, isSessionLoading, rootId, fetchLetterData, router]);

  useEffect(() => {
    if (letterData?.currentCompany) {
      document.title = `View Letter: ${letterData.currentCompany} - CoverSumé`;
    } else {
      document.title = "View Cover Letter - CoverSumé";
    }
  }, [letterData]);

  const handleVersionChange = (version: CoverLetterVersion) => {
    setSelectedVersion(version);
    // Update URL query param without full page reload
    router.push(`/history/${rootId}?versionId=${version.id}`, {
      scroll: false,
    });
  };

  const handleCopyToClipboard = () => {
    if (selectedVersion?.content) {
      // Replace <br/> with newlines for plain text copy
      const plainTextContent = selectedVersion.content.replace(
        /<br\s*\/?>/gi,
        "\n"
      );
      navigator.clipboard.writeText(plainTextContent);
      toast.success("Cover letter copied to clipboard!");
    }
  };

  const getDocumentName = () => {
    const company = letterData?.currentCompany || "Company";
    const role = letterData?.currentJobRole || "Role";
    const date = letterData?.originalDate
      ? new Date(letterData.originalDate).toLocaleDateString("en-CA") // YYYY-MM-DD for filename
      : new Date().toLocaleDateString("en-CA");
    return `${role} - ${company} - ${date}`;
  };

  const handleDownloadPDF = () => {
    if (selectedVersion?.content) {
      const docName = getDocumentName();
      const plainTextContent = selectedVersion.content.replace(
        /<br\s*\/?>/gi,
        "\n"
      );
      const pdf = new jsPDF();
      const lines = pdf.splitTextToSize(plainTextContent, 180); // wraps text
      pdf.text(lines, 10, 10);
      pdf.save(docName + ".pdf");
      toast.success("Downloaded as PDF!");
    }
  };

  const handleDownloadDOCX = async () => {
    if (selectedVersion?.content) {
      const docName = getDocumentName();
      const plainTextContent = selectedVersion.content.replace(
        /<br\s*\/?>/gi,
        "\n"
      );
      const paragraphs = plainTextContent.split("\n").map(
        (line) =>
          new Paragraph({
            children: [new TextRun(line)],
          })
      );
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });
      const blob = await DocxPacker.toBlob(doc);
      saveAs(blob, docName + ".docx");
      toast.success("Downloaded as DOCX!");
    }
  };

  const handleDownloadTXT = () => {
    if (selectedVersion?.content) {
      const docName = getDocumentName();
      const plainTextContent = selectedVersion.content.replace(
        /<br\s*\/?>/gi,
        "\n"
      );
      const blob = new Blob([plainTextContent], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, docName + ".txt");
      toast.success("Downloaded as TXT!");
    }
  };

  if (isLoading || isSessionLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!letterData || !selectedVersion) {
    return (
      <div className="pt-28 pb-16 container-custom text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Cover Letter Not Found</h1>
        <p className="text-gray-600 mb-6">
          The requested cover letter could not be loaded or you do not have
          access.
        </p>
        <Button asChild variant="outline">
          <Link href="/history">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to History
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/history">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {letterData.currentCompany || "Cover Letter"}
          </h1>
          <p className="text-xl text-gray-600">
            {letterData.currentJobRole || "Details"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls and Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <Button
                  onClick={handleCopyToClipboard}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Clipboard className="mr-2 h-4 w-4" /> Copy to Clipboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <DownloadIcon className="mr-2 h-4 w-4" /> Download As
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={handleDownloadPDF}>
                      PDF Document (.pdf)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadDOCX}>
                      Word Document (.docx)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadTXT}>
                      Text File (.txt)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  asChild
                  variant="default"
                  className="w-full justify-start"
                >
                  <Link
                    href={`/generator?rootId=${rootId}&versionId=${selectedVersion.id}`}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit This Version
                  </Link>
                </Button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-3">Versions</h2>
              {letterData.versions.length > 1 ? (
                <div className="flex items-center justify-between mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentIndex = letterData.versions.findIndex(
                        (v) => v.id === selectedVersion.id
                      );
                      if (currentIndex > 0)
                        handleVersionChange(
                          letterData.versions[currentIndex - 1]
                        );
                    }}
                    disabled={
                      letterData.versions.findIndex(
                        (v) => v.id === selectedVersion.id
                      ) === 0
                    }
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <span className="text-sm text-gray-600">
                    Version {selectedVersion.versionNumber} of{" "}
                    {letterData.versions.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentIndex = letterData.versions.findIndex(
                        (v) => v.id === selectedVersion.id
                      );
                      if (currentIndex < letterData.versions.length - 1)
                        handleVersionChange(
                          letterData.versions[currentIndex + 1]
                        );
                    }}
                    disabled={
                      letterData.versions.findIndex(
                        (v) => v.id === selectedVersion.id
                      ) ===
                      letterData.versions.length - 1
                    }
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">
                  Only one version exists.
                </p>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>
                      Version {selectedVersion.versionNumber}{" "}
                      {selectedVersion.refinementTypeUsed && (
                        <Badge variant="secondary" className="ml-1.5">
                          {selectedVersion.refinementTypeUsed}
                        </Badge>
                      )}
                    </span>
                    <Layers className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuLabel>Select Version</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {letterData.versions.map((version) => (
                    <DropdownMenuItem
                      key={version.id}
                      onClick={() => handleVersionChange(version)}
                      disabled={version.id === selectedVersion.id}
                    >
                      Version {version.versionNumber}
                      {version.refinementTypeUsed && (
                        <Badge variant="outline" className="ml-auto">
                          {version.refinementTypeUsed}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 ml-2">
                        ({new Date(version.createdAt).toLocaleDateString()})
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right Column - Letter Content */}
          <div className="lg:col-span-2 card">
            <div className="p-6 sm:p-8 h-[calc(100vh-200px)] overflow-y-auto prose max-w-none prose-sm sm:prose-base focus:outline-none">
              {/* The key on ReactMarkdown helps re-render if content changes significantly */}
              <ReactMarkdown
                key={selectedVersion.id}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]} // Handles <br/> tags
              >
                {selectedVersion.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterViewerPage;
