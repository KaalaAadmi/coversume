"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth/auth-client";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import remarkGfm from "remark-gfm"; // Import remark-gfm
import rehypeRaw from "rehype-raw"; // Import rehype-raw
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
// import SimpleMDE from "react-simplemde-editor";
import { SimpleMdeReact } from "react-simplemde-editor";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { date } from "zod";

// import "simplemde/dist/simplemde.min.css";

type Inputs = {
  // resumeText: string;
  jobDescription: string;
  name: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  language: string;
};

interface CoverLetterResponse {
  jobRole: string | null;
  company: string | null;
  coverLetter: string;
}

type Token = string;

const TYPING_ANIMATION_DELAY_MS = 25; // Adjust for typing speed (milliseconds per token)

const GeneratorPage: React.FC = () => {
  const { data: session } = useSession();
  const [step, setStep] = useState<number>(1);
  const [resumeText, setResumeText] = useState<string>("");
  // const [jobDescription, setJobDescription] = useState<string>("");
  // const [name, setName] = useState<string>("");
  // const [email, setEmail] = useState<string>("");
  // const [phone, setPhone] = useState<string>("");
  // const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false); // New state for cursor
  const [generatedLetter, setGeneratedLetter] = useState<string>("");
  // const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [letterFeedback, setLetterFeedback] = useState<string | null>(null);
  const [jobRole, setJobRole] = useState<string | null>(null);
  const [company, setCompany] = useState<string | null>(null);
  const [localDate, setLocalDate] = useState<string>("");
  const [editableLetter, setEditableLetter] = useState(generatedLetter);
  // type Position = { line: number; ch: number }; // Add this type definition above or here
  // States for letter versions
  const [letterVersions, setLetterVersions] = useState<string[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState<number>(-1);
  const [activeCoverLetterRootId, setActiveCoverLetterRootId] = useState<
    string | null
  >(null); // New state for rootId

  // const [lineAndCursor, setLineAndCursor] = useState<Position | null>(null);

  // const getLineAndCursorCallback = useCallback((position: Position) => {
  //   setLineAndCursor(position);
  // }, []);

  // useEffect(() => {
  //   if (lineAndCursor) {
  //     console.info("Hey I'm line and cursor info!", lineAndCursor);
  //   }
  // }, [lineAndCursor]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<Inputs>({
    defaultValues: {
      // resumeText: "",
      jobDescription: "",
      name: "",
      email: "",
      phone: "",
      portfolioUrl: "",
      language: "English",
    },
  });

  const watchedJobDescription = watch("jobDescription");

  useEffect(() => {
    document.title = "Generate Cover Letter - CoverSumé";
    window.scrollTo(0, 0);
    // Pre-fill form with session data if available
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
    }
    const locale = navigator.language || "en-US"; // fallback to en-US
    // console.log("LOCALE:", locale);s
    const date = new Date();
    const formattedDate = date.toLocaleDateString(locale, {
      // weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    console.log(date);
    setLocalDate(formattedDate);
    // setLocalTime(timeString);
    console.log("Formatted Date:", formattedDate);
  }, [session, setValue]);
  // let editorKey, editorReadOnly;
  useEffect(() => {
    if (isTyping) {
      // During the typing animation, the Editor should display the incrementally built generatedLetter
      setEditableLetter(generatedLetter);
    } else {
      // When not typing (e.g., after animation is done, or when navigating versions),
      // set the editor's content from the current version in letterVersions.
      if (
        currentVersionIndex >= 0 &&
        letterVersions[currentVersionIndex] !== undefined
      ) {
        const currentVersionContent = letterVersions[currentVersionIndex];
        setEditableLetter(currentVersionContent);
        // Also, ensure generatedLetter (used for UI conditions like button visibility)
        // reflects the current complete version when not typing.
        setGeneratedLetter(currentVersionContent);
      } else if (letterVersions.length === 0 && currentVersionIndex === -1) {
        // If there are no versions (e.g., initial state or after a reset), clear both.
        setEditableLetter("");
        setGeneratedLetter("");
      }
    }
  }, [generatedLetter, letterVersions, currentVersionIndex, isTyping]); // Add generatedLetter to dependencies
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          setResumeText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("Ready to generate cover letter with data:", data);
    setIsLoading(true);
    setIsTyping(false);
    setGeneratedLetter("");
    setEditableLetter("");
    setLetterVersions([]);
    setCurrentVersionIndex(-1);
    setActiveCoverLetterRootId(null); // Reset active root ID for a new generation
    setJobRole(null);
    setCompany(null);
    // setStep(2); // Move to step 2 to show loading/preview area

    try {
      const { jobDescription, name, email, phone, portfolioUrl, language } =
        data;
      // TODO: Change the API URL to the production one which has AI and not the dummy one as it is now.
      // const response = await fetch("/api/cover-letter/generate", {
      const response = await fetch("http://localhost:8000/api/cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // TODO: Get the date in user's timezone

        body: JSON.stringify({
          date: localDate,
          resumeText,
          jobDescription,
          name: name || session?.user.name,
          email: email || session?.user.email,
          phoneNumber: phone, // Ensure your API expects 'phoneNumber'
          portfolioUrl,
          language: language || "English",
          userId: session?.user.id,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        toast.error(
          `Failed to generate: ${errorData.message || "Unknown error"}`
        );
        console.error(`API ERROR: ${response.status}`, errorData);
        setStep(1); // Optionally revert step
        setIsLoading(false);
        return;
      }

      const responseData = await response.json();
      // responseData should be: { jobRole, company, coverLetter }

      // setJobRole(responseData.jobRole);
      // setCompany(responseData.company);

      // let fullCoverLetter = responseData.coverLetter || "";
      setActiveCoverLetterRootId(responseData.rootId); // Store the rootId
      setJobRole(responseData.jobRole);
      setCompany(responseData.company);

      let fullCoverLetter = responseData.coverLetter || "";

      // Pre-process newlines for ReactMarkdown:
      // Replace \n\n (or more) with a unique placeholder for paragraph breaks
      // Replace single \n with <br />
      // Then restore paragraph breaks. This gives more control.
      // However, remark-gfm should handle this. Let's simplify and rely on remark-gfm first.
      // If issues persist, this pre-processing can be added:
      fullCoverLetter = fullCoverLetter.trim(); // Trim leading/trailing whitespace

      fullCoverLetter = fullCoverLetter
        // .replace(/\n{2,}/g, "\n\n") // Normalize multiple newlines to exactly two
        // .replace(/(?<!\n)\n(?!\n)/g, "<br /><br/ >"); // Single \n to <br/> (if not part of \n\n)
        .replace(/\n/g, "<br/>");

      if (fullCoverLetter) {
        setIsTyping(true); // Start typing animation
        // Split by words, sequences of newlines, or sequences of spaces.
        // This helps treat newlines as distinct "typing" steps.
        const tokens: Token[] = fullCoverLetter
          .split(/(\n+|\s+|\S+)/g) // Split by newlines, spaces, or words
          .filter((token: string) => token && token.length > 0);

        let currentText = "";
        for (const token of tokens) {
          currentText += token;
          setGeneratedLetter(currentText); // Pure markdown string
          // Only add delay if the token is not purely whitespace,
          // or make delay for whitespace very small if desired.
          // For simplicity, delaying for all tokens here.
          await new Promise((resolve) =>
            setTimeout(resolve, TYPING_ANIMATION_DELAY_MS)
          );
        }
        setIsTyping(false); // End typing animation
        // Check the below line!!!!
        // setGeneratedLetter(currentText); // Final text is already in generatedLetter
        setLetterVersions([currentText]); // Save the first version
        setCurrentVersionIndex(0);
      } else {
        setGeneratedLetter("No cover letter content received.");
        setIsTyping(false); // End typing animation
        toast.info("Cover letter content was empty.");
      }
    } catch (error) {
      console.error("Failed to generate cover letter (onSubmit):", error);
      toast.error(
        "An unexpected error occurred. Please check console for details."
      );
      setGeneratedLetter("Error generating cover letter. Please try again.");
      setStep(1); // Optionally revert step
      setIsTyping(false); // Ensure typing state is reset
    } finally {
      // setIsLoading(false) will be called regardless of typing animation completion
      // If you want loading to stop only after typing, move it from here
      // and set it after the loop or in the catch if error before loop.
      // For now, let's assume isLoading primarily covers API call and initial setup.
      // The isTyping state handles the animation phase.
      // If API call is quick, and typing is long, user sees loading briefly, then typing.
      // If isLoading should cover the whole typing animation:
      // 1. Remove setIsLoading(false) from finally.
      // 2. Add setIsLoading(false) after the typing loop completes successfully.
      // 3. Add setIsLoading(false) in the catch block if an error occurs *before or during* typing.
      // Let's keep it simple: isLoading for API, isTyping for animation.
      setIsLoading(false); // API call is done, main loading is over.
      // Typing animation will proceed if successful.
      setStep(2); // Move to step 2 to show generated letter
    }
  };

  const handleDownloadPDF = () => {
    const docName = `${jobRole} - ${company} - ${localDate}`;
    const cover = editableLetter.replace(/<br\s*\/?>/gi, "\n");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(cover, 180); // wraps text
    doc.text(lines, 10, 10);
    doc.save(docName + ".pdf");
    toast.success("Cover letter downloaded as PDF successfully!");
  };

  const handleDownloadDOCX = async () => {
    const docName = `${jobRole} - ${company} - ${localDate}`;
    const cover = editableLetter.replace(/<br\s*\/?>/gi, "\n");
    const paragraphs = cover.split("\n").map(
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

    const blob = await Packer.toBlob(doc);
    saveAs(blob, docName + ".docx");
    toast.success("Cover letter downloaded as DOCX successfully!");
  };
  const handleDownloadTXT = async () => {
    const docName = `${jobRole} - ${company} - ${localDate}`;
    const cover = editableLetter.replace(/<br\s*\/?>/gi, "\n");
    const blob = new Blob([cover], { type: "text/plain;charset=utf-8" });
    await saveAs(blob, docName + ".txt");
    toast.success("Cover letter downloaded as TXT successfully!");
  };

  const handleEditorTextChange = (e: EditorTextChangeEvent) => {
    const newContent = e.htmlValue ?? "";
    setEditableLetter(newContent); // Update for immediate display in editor

    // If not currently typing via animation, update the version in state
    if (!isTyping && currentVersionIndex !== -1) {
      setLetterVersions((prevVersions) => {
        const updatedVersions = [...prevVersions];
        if (updatedVersions[currentVersionIndex] !== undefined) {
          updatedVersions[currentVersionIndex] = newContent;
        }
        return updatedVersions;
      });
      // Also keep generatedLetter in sync if it's used elsewhere
      setGeneratedLetter(newContent);
    }
  };

  const handleRefinement = async (refinementType: string) => {
    // 1. Set feedback and loading state immediately to update UI
    setLetterFeedback(
      `Refining letter to be ${refinementType.toLowerCase()}...`
    );
    setIsLoading(true);
    // isTyping should be false here, so the condition (isLoading && !isTyping) for the loader will be met.
    setIsTyping(false); // Ensure typing state is reset

    // In a real app, this would call an API to refine the letter
    try {
      if (!activeCoverLetterRootId) {
        toast.error("Cannot refine: No active cover letter session found.");
        setIsLoading(false);
        setLetterFeedback(null);
        return;
      }
      // TODO: Change the API URL to the production one which has AI and not the dummy one as it is now.
      // const response = await fetch(
      //   "/api/cover-letter/refine",
      const response = await fetch(
        "http://localhost:8000/api/cover-letter/refine",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rootId: activeCoverLetterRootId, // Use the stored rootId
            date: localDate,
            refinementType,
            coverLetter: editableLetter, // Send the current content of the editor
            resumeText, // Make sure this is up-to-date if it can change
            jobDescription: watchedJobDescription, // Use watched value from react-hook-form
            name: getValues("name"),
            email: getValues("email"),
            phoneNumber: getValues("phone"),
            portfolioUrl: getValues("portfolioUrl"),
            language: getValues("language") || "English",
            userId: session?.user.id, // Include if your API uses it
          }),
        }
      );
      setIsLoading(false); // Set loading to false after API call

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        toast.error(
          `Refinement failed: ${errorData.message || "Unknown error"}`
        );
        console.error(`API REFINEMENT ERROR: ${response.status}`, errorData);
        // letterFeedback is already "Refining...", isLoading will be set to false in finally
        toast.error("An error occurred while refining the letter.");
        setLetterFeedback(null);
        return; // Exit if API call fails
      }
      const refinedData = await response.json();
      let refinedCoverLetter = refinedData.coverLetter || editableLetter;
      refinedCoverLetter = refinedCoverLetter.trim().replace(/\n/g, "<br/>");

      if (refinedCoverLetter) {
        setLetterFeedback(null); // Clear "Refining..." message
        setIsTyping(true); // Start typing animation for refined text
        setGeneratedLetter(""); // Clear the editor before typing new content

        const tokens: Token[] = refinedCoverLetter
          .split(/(\n+|\s+|\S+)/g)
          .filter((token: string) => token && token.length > 0);

        let currentText = "";
        for (const token of tokens) {
          currentText += token;
          setGeneratedLetter(currentText);
          await new Promise((resolve) =>
            setTimeout(resolve, TYPING_ANIMATION_DELAY_MS)
          );
        }
        setIsTyping(false);
        // setGeneratedLetter(currentText); // Final text is in generatedLetter

        // Add as a new version, discarding subsequent versions if any
        const newVersions = [
          ...letterVersions.slice(0, currentVersionIndex + 1),
          currentText, // The fully typed refined letter
        ];
        setLetterVersions(newVersions);
        setCurrentVersionIndex(newVersions.length - 1);
        toast.success("Letter refined!");
      } else {
        toast.info("Refinement resulted in empty content. Reverting.");
        // Optionally, revert to editableLetter or handle as an error
        // setGeneratedLetter(editableLetter);
      }
    } catch (error) {
      console.error("Failed to refine cover letter (handleRefinement):", error);
      toast.error("An unexpected error occurred during refinement.");
      // letterFeedback will still show the "Refining..." message or the error toast will be more prominent
      setLetterFeedback(null); // Clear "Refining..." message
      setIsLoading(false); // Ensure loading state is reset
    } finally {
      // 2. Always set isLoading to false after the operation completes (success or error)
      setIsLoading(false);
      setIsTyping(false); // End typing animation
      // Optionally, clear the specific letterFeedback after a few seconds
      // setTimeout(() => setLetterFeedback(null), 3000);
      setLetterFeedback(null); // Clear feedback after refinement
    }
  };

  const editorReadOnly = isTyping || isLoading;
  const editorKey = editorReadOnly ? "editor-readonly" : "editor-editable";

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
            className={`lg:col-span-1 ${
              step === 2 && !isTyping ? "hidden lg:block" : ""
            }`} // Keep visible during typing
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Input Information
                </h2>

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
                  <Textarea
                    id="resume-text"
                    rows={5}
                    className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  ></Textarea>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <label
                    htmlFor="job-description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Job Description
                  </label>
                  <Textarea
                    id="job-description"
                    rows={5}
                    className="overflow-y-scroll w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Paste the job description here..."
                    // value={jobDescription}
                    // onChange={(e) => setJobDescription(e.target.value)}
                    {...register("jobDescription", {
                      required: "Job description is required",
                    })}
                  ></Textarea>
                  {errors.jobDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobDescription.message}
                    </p>
                  )}
                </div>

                {/* Language Selection */}
                <div className="mb-6">
                  <Label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Language
                  </Label>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={getValues("language")}
                      >
                        <SelectTrigger className="w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent className="rounded border-gray-300 shadow-sm">
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Chinese">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.language && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.language.message}
                    </p>
                  )}
                  {/* <select
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
                </select> */}
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
                      <Input
                        type="text"
                        placeholder="Your Name"
                        className="w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue={session?.user?.name}
                        // onChange={(e) => setName(e.target.value)}
                        {...register("name")}
                      />

                      {/* <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    /> */}
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        className="w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue={session?.user?.email}
                        // onChange={(e) => setEmail(e.target.value)}
                        {...register("email")}
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        // value={phone}
                        // onChange={(e) => setPhone(e.target.value)}
                        {...register("phone")}
                      />
                    </div>
                    <div>
                      <Input
                        type="url"
                        placeholder="Portfolio URL (optional)"
                        className="w-full rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        // value={portfolioUrl}
                        // onChange={(e) => setPortfolioUrl(e.target.value)}
                        {...register("portfolioUrl")}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  // className="btn btn-primary w-full justify-center py-3"
                  // onClick={handleSubmit}
                  type="submit"
                  disabled={
                    isLoading ||
                    isTyping ||
                    !resumeText ||
                    !watchedJobDescription
                  }
                >
                  {isLoading &&
                    !isTyping && ( // Show "Generating..." only during API call
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Generating...
                      </div>
                    )}
                  {isTyping && ( // Show "Typing..." during animation
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Writing...
                    </div>
                  )}
                  {!isLoading &&
                    !isTyping && ( // Default button text
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Cover Letter
                      </>
                    )}
                </Button>
              </div>
            </form>
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
                  {step === 1 && !generatedLetter
                    ? "Preview"
                    : "Generated Cover Letter"}
                </h2>
                {step === 2 &&
                  !isTyping &&
                  generatedLetter !== "" && ( // Show buttons after typing
                    <div className="flex items-center space-x-2">
                      {letterVersions.length > 1 && !isTyping && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="link"
                            className={`${
                              currentVersionIndex === 0
                                ? "cursor-not-allowed"
                                : ""
                            } underline-none hover:underline-none`}
                            size="sm"
                            onClick={() =>
                              setCurrentVersionIndex(currentVersionIndex - 1)
                            }
                            disabled={currentVersionIndex === 0}
                            aria-label="Previous version"
                          >
                            &lt;
                          </Button>
                          <span className="text-sm text-gray-600 p-1">
                            {currentVersionIndex + 1} / {letterVersions.length}
                          </span>
                          <Button
                            variant="link"
                            size="sm"
                            className={`${
                              currentVersionIndex === letterVersions.length - 1
                                ? "cursor-not-allowed"
                                : ""
                            } underline-none hover:underline-none`}
                            onClick={() =>
                              setCurrentVersionIndex(currentVersionIndex + 1)
                            }
                            disabled={
                              currentVersionIndex === letterVersions.length - 1
                            }
                            aria-label="Next version"
                          >
                            &gt;
                          </Button>
                        </div>
                      )}
                      <button
                        className="btn btn-outline py-1 px-3"
                        onClick={() => {
                          // Replace the `<br/>` tags with newlines
                          const cover = generatedLetter.replace(
                            /<br\s*\/?>/gi,
                            "\n"
                          );
                          toast.success("Cover letter copied to clipboard!");
                          // const cover=generatedLetter.replace()
                          navigator.clipboard.writeText(cover);
                        }}
                      >
                        <Clipboard className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="btn btn-outline py-1 px-3">
                          <FileDown className="h-4 w-4 mr-1" />
                          Download
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>
                            Download Options
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDownloadPDF()}>
                            PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadDOCX()}
                          >
                            DOCX
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadTXT()}>
                            TXT
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* <button className="btn btn-outline py-1 px-3">
                        <FileDown className="h-4 w-4 mr-1" />
                        Download
                      </button> */}
                    </div>
                  )}
              </div>

              <div className="p-6 h-[calc(100vh-2.5rem)] overflow-y-auto bg-gray-50">
                {step === 1 && !isLoading && !isTyping ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    {resumeText && watchedJobDescription ? (
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
                ) : isLoading && !isTyping ? (
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
                  // Displaying generated letter (or typing animation)
                  <div
                    className="max-w-none h-full overflow-y-auto"
                    // style={{ whiteSpace: "pre-wrap" }} // Add this style
                  >
                    {/* <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {generatedLetter}
                    </ReactMarkdown> */}
                    {/* <SimpleMdeReact
                      className="h-full flex-1"
                      // getLineAndCursor={getLineAndCursorCallback}
                      value={generatedLetter.replace(/<br\s*\/?>/gi, "\n")}
                      onChange={(value) => setEditableLetter(value)}
                      options={{
                        spellChecker: false,
                        placeholder: "Edit your cover letter...",
                      }}
                    /> */}
                    <Editor
                      key={editorKey} // Add key here
                      value={editableLetter}
                      className={"h-full flex-1 border-none "}
                      readOnly={editorReadOnly} // Use the derived variable
                      style={{ fontSize: "16px", border: "none" }}
                      showHeader={false}
                      // onChange={(value) => setEditableLetter(value)}
                      onTextChange={handleEditorTextChange}
                    />
                    {/* {isTyping && (
                      <span className="blinking-cursor inline">▋</span>
                    )} */}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* TODO: Implement the logic for refinement */}
          {/* Right Column - Refinement Panel (Only visible in step 2) */}
          {step === 2 &&
            !isLoading &&
            !isTyping &&
            generatedLetter && ( // Show only after typing is complete
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
                      onClick={() =>
                        handleRefinement("More Achievement-Focused")
                      }
                    >
                      <RefreshCw className="h-5 w-5 mr-3 text-amber-600" />
                      Emphasize achievements
                    </button>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-3">
                      Rate This Letter
                    </h3>
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
