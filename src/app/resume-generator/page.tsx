"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  FileText,
  Download,
  Trash2,
  PlusCircle,
  Settings2,
  Palette,
  Users,
} from "lucide-react";
import { ResumePreview } from "@/components/resume/resume-preview";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import { Packer } from "docx";
// import { saveAs } from "file-saver";

// Define Zod schema for validation
const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  school: z.string().min(1, "School name is required"),
  location: z.string().optional(),
  graduationDate: z.string().optional(),
  grade: z.string().optional(), // <-- ADDED
  description: z.string().optional(),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
  role: z.string().optional(),
});

const skillSchema = z.object({
  programming: z.string().optional(),
  frameworks: z.string().optional(),
  tools: z.string().optional(),
  platforms: z.string().optional(),
  design: z.string().optional(),
  methodologies: z.string().optional(),
  management: z.string().optional(),
  marketing: z.string().optional(),
  writing: z.string().optional(),
  languages: z.string().optional(),
  certifications: z.string().optional(),
  interests: z.string().optional(),
});

const activitySchema = z.object({
  organization: z.string().min(1, "Organization name is required"),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(), // For bullet points or details
});

const resumeFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phoneNumber: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  summary: z.string().optional(),
  experiences: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: skillSchema.optional(), // Comma-separated or one skill per line
  projects: z.array(projectSchema).optional(),
  activities: z.array(activitySchema).optional(), // <-- ADD THIS LINE
});

export type ResumeFormData = z.infer<typeof resumeFormSchema>;

const ResumeGeneratorPage: React.FC = () => {
  const [resumePreviewData, setResumePreviewData] =
    useState<ResumeFormData | null>(null);
  const [activeAccordionItems, setActiveAccordionItems] = useState<string[]>([
    "personalDetails",
    "summary",
  ]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      experiences: [{ jobTitle: "", company: "", description: "" }],
      education: [
        {
          //   degree: "",
          //   school: "",
          //   grade: "",
          //   graduationDate: "",
          //   description: "",
          //   location: "",
        },
      ],
      projects: [{ name: "", description: "" }],
      skills: {
        programming: "",
        design: "",
        marketing: "",
        writing: "",
        management: "",
        languages: "",
        certifications: "",
        tools: "",
        methodologies: "",
        interests: "",
        platforms: "",
        frameworks: "",
      },
      activities: [{ organization: "", role: "", description: "" }], // <-- ADD THIS LINE
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experiences",
  });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });
  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control,
    name: "activities",
  });

  useEffect(() => {
    document.title = "Resume Generator - CoverSumé";
    window.scrollTo(0, 0);
  }, []);

  const onSubmit: SubmitHandler<ResumeFormData> = (data) => {
    console.log("Resume Data:", data);
    setResumePreviewData(data); // Update preview on submit
    toast.success("Resume preview updated!");
  };

  // Watch all form values to update preview in real-time (optional, can be heavy)
  const watchedValues = watch();
  useEffect(() => {
    // For a true real-time preview, you might update resumePreviewData here
    // Be cautious as this can be performance-intensive for large forms
    // setResumePreviewData(watchedValues);
  }, [watchedValues]);

  const handleDownloadPDF = async () => {
    toast.info("PDF download functionality to be implemented.");
    // const input = document.getElementById('resume-preview-content');
    // if (input) {
    //   html2canvas(input).then((canvas) => {
    //     const imgData = canvas.toDataURL('image/png');
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pdfHeight = pdf.internal.pageSize.getHeight();
    //     const imgWidth = canvas.width;
    //     const imgHeight = canvas.height;
    //     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    //     const imgX = (pdfWidth - imgWidth * ratio) / 2;
    //     const imgY = 30; // Margin from top
    //     pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    //     pdf.save(`${resumePreviewData?.fullName || 'resume'}.pdf`);
    //     toast.success("Resume downloaded as PDF!");
    //   });
    // }
  };

  const handleDownloadDOCX = async () => {
    toast.info("DOCX download functionality to be implemented.");
    // Placeholder for docx generation
  };

  const handleDownloadTXT = async () => {
    toast.info("TXT download functionality to be implemented.");
    // Placeholder for txt generation
  };

  return (
    <div className="pt-28 pb-16 bg-zinc-50 dark:bg-transparent min-h-screen">
      <div className="container-custom">
        <div className="mb-10 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Resume Builder
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Craft a professional, ATS-friendly resume in minutes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Input Form */}
          <motion.div
            className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[calc(100vh-10rem)]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="">
              {" "}
              {/* This div will contain the fixed header and the scrollable form */}
              {/* Fixed Header Part - see point 3 */}
              <div className="p-6 border-b bg-background sticky top-0 z-10">
                {" "}
                {/* Added sticky, top-0, z-10 and bg-background */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Resume Details</h2>
                  <Button onClick={handleSubmit(onSubmit)} size="sm">
                    <FileText className="mr-2 h-4 w-4" /> Update Preview
                  </Button>
                </div>
              </div>
              {/* Scrollable Form Part (Accordion) - see point 3 */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {" "}
                {/* Added flex-grow and overflow-y-auto */}
                <form>
                  {" "}
                  {/* No action, handled by react-hook-form's handleSubmit */}
                  <Accordion
                    type="multiple"
                    value={activeAccordionItems}
                    onValueChange={setActiveAccordionItems}
                    className="w-full space-y-4"
                  >
                    {/* Personal details */}
                    <AccordionItem
                      value="personalDetails"
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <User className="mr-2 h-5 w-5 text-primary" />{" "}
                          Personal Details
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-4 border-t">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            {...register("fullName")}
                            placeholder="e.g., John Doe"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.fullName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="e.g., john.doe@example.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            {...register("phoneNumber")}
                            placeholder="e.g., (123) 456-7890"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address (Optional)</Label>
                          <Input
                            id="address"
                            {...register("address")}
                            placeholder="e.g., City, State"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">
                            LinkedIn Profile (Optional)
                          </Label>
                          <Input
                            id="linkedin"
                            {...register("linkedin")}
                            placeholder="e.g., linkedin.com/in/johndoe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio">
                            Portfolio/Website (Optional)
                          </Label>
                          <Input
                            id="portfolio"
                            {...register("portfolio")}
                            placeholder="e.g., github.com/johndoe"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Professional summary */}
                    <AccordionItem
                      value="summary"
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-primary" />{" "}
                          Summary/Objective
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 border-t">
                        <Label htmlFor="summary">
                          Professional Summary or Objective(Optional)
                        </Label>
                        <Textarea
                          id="summary"
                          {...register("summary")}
                          placeholder="A brief overview of your career goals and qualifications..."
                          rows={4}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    {/* Education */}
                    <AccordionItem
                      value="education"
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <GraduationCap className="mr-2 h-5 w-5 text-primary" />{" "}
                          Education
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-4 border-t">
                        {educationFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="p-3 border rounded-md space-y-3 relative"
                          >
                            <Label htmlFor={`degree-${index}`}>
                              Degree / Certificate
                            </Label>
                            <Input
                              id={`degree-${index}`}
                              placeholder="Degree / Certificate"
                              {...register(`education.${index}.degree`)}
                            />
                            {errors.education?.[index]?.degree && (
                              <p className="text-red-500 text-xs">
                                {errors.education[index]?.degree?.message}
                              </p>
                            )}
                            <Label htmlFor={`school-${index}`}>
                              School / Institution
                            </Label>
                            <Input
                              id={`school-${index}`}
                              placeholder="School / Institution"
                              {...register(`education.${index}.school`)}
                            />
                            {errors.education?.[index]?.school && (
                              <p className="text-red-500 text-xs">
                                {errors.education[index]?.school?.message}
                              </p>
                            )}
                            <Label htmlFor={`location-${index}`}>
                              Location
                            </Label>
                            <Input
                              id={`location-${index}`}
                              placeholder="Location (e.g. City, State)"
                              {...register(`education.${index}.location`)}
                            />
                            <Label htmlFor={`education.${index}.grade`}>
                              Grade/GPA (Optional)
                            </Label>
                            <Input
                              id={`education.${index}.grade`}
                              placeholder="e.g., 2.1, 3.8/4.0"
                              {...register(`education.${index}.grade`)}
                            />
                            <Label htmlFor={`graduationDate-${index}`}>
                              Graduation Date
                            </Label>
                            <Input
                              id={`graduationDate-${index}`}
                              placeholder="Graduation Date (e.g. May 2024)"
                              {...register(`education.${index}.graduationDate`)}
                            />
                            <Label htmlFor={`description-${index}`}>
                              Description
                            </Label>
                            <Textarea
                              id={`description-${index}`}
                              placeholder="Relevant coursework, honors, or activities..."
                              {...register(`education.${index}.description`)}
                              rows={2}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                              onClick={() => removeEducation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            appendEducation({
                              degree: "",
                              school: "",
                              grade: "",
                              graduationDate: "",
                              description: "",
                              location: "",
                            })
                          }
                          className="w-full"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Experience */}
                    <AccordionItem
                      value="experience"
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <Briefcase className="mr-2 h-5 w-5 text-primary" />{" "}
                          Work Experience
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-4 border-t">
                        {experienceFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="p-3 border rounded-md space-y-3 relative"
                          >
                            <Label htmlFor="jobtitle">Job Title</Label>
                            <Input
                              id={`jobtitle`}
                              placeholder="Job Title"
                              {...register(`experiences.${index}.jobTitle`)}
                            />
                            {errors.experiences?.[index]?.jobTitle && (
                              <p className="text-red-500 text-xs">
                                {errors.experiences[index]?.jobTitle?.message}
                              </p>
                            )}
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id={`company`}
                              placeholder="Company"
                              {...register(`experiences.${index}.company`)}
                            />
                            {errors.experiences?.[index]?.company && (
                              <p className="text-red-500 text-xs">
                                {errors.experiences[index]?.company?.message}
                              </p>
                            )}
                            <Label htmlFor="location">
                              Location (e.g. City, State)
                            </Label>
                            <Input
                              id={`location`}
                              placeholder="Location (e.g. City, State)"
                              {...register(`experiences.${index}.location`)}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                  id={`startDate`}
                                  placeholder="Start Date (e.g. Jan 2020)"
                                  {...register(
                                    `experiences.${index}.startDate`
                                  )}
                                />
                              </div>
                              <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                  id={`endDate`}
                                  placeholder="End Date (e.g. Present)"
                                  {...register(`experiences.${index}.endDate`)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`description`}>
                                Key responsibilities and achievements
                              </Label>
                              <Textarea
                                id={`description`}
                                placeholder="Key responsibilities and achievements..."
                                {...register(
                                  `experiences.${index}.description`
                                )}
                                rows={3}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Use a new line for each bullet
                                point/responsibility.
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                              onClick={() => removeExperience(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            appendExperience({
                              jobTitle: "",
                              company: "",
                              description: "",
                            })
                          }
                          className="w-full"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Projects */}
                    <AccordionItem
                      value="projects"
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <Settings2 className="mr-2 h-5 w-5 text-primary" />{" "}
                          Projects
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-4 border-t">
                        {projectFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="p-3 border rounded-md space-y-3 relative"
                          >
                            <Label htmlFor="projectName">Project Name</Label>
                            <Input
                              id="projectName"
                              placeholder="Project Name"
                              {...register(`projects.${index}.name`)}
                            />
                            {errors.projects?.[index]?.name && (
                              <p className="text-red-500 text-xs">
                                {errors.projects[index]?.name?.message}
                              </p>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                  id={`startDate`}
                                  placeholder="Start Date (e.g. Jan 2020)"
                                  {...register(`projects.${index}.startDate`)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                  id={`endDate`}
                                  placeholder="End Date (e.g. Present)"
                                  {...register(`projects.${index}.endDate`)}
                                />
                              </div>
                            </div>
                            <Label htmlFor="role">Role</Label>
                            <Input
                              id={`role`}
                              placeholder="Role"
                              {...register(`projects.${index}.role`)}
                            />
                            <div>
                              <Label htmlFor="projectDescription">
                                Project Description
                              </Label>
                              <Textarea
                                id="projectDescription"
                                placeholder="Project description, technologies used, your role..."
                                {...register(`projects.${index}.description`)}
                                rows={3}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Use a new line for each bullet point.
                              </p>
                            </div>
                            <Label htmlFor="projectLink">
                              Project Link (Optional)
                            </Label>
                            <Input
                              id="projectLink"
                              placeholder="Project Link (Optional)"
                              {...register(`projects.${index}.link`)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                              onClick={() => removeProject(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            appendProject({ name: "", description: "" })
                          }
                          className="w-full"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Activities */}
                    <AccordionItem
                      value="activities"
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <Users className="mr-2 h-5 w-5 text-primary" />{" "}
                          {/* Or Award icon */}
                          Activities & Leadership
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-4 border-t">
                        {activityFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="p-3 border rounded-md space-y-3 relative"
                          >
                            <Label htmlFor={`activities.${index}.organization`}>
                              Organization/Club
                            </Label>
                            <Input
                              id={`activities.${index}.organization`}
                              placeholder="e.g., Rotary Club, Student Council"
                              {...register(`activities.${index}.organization`)}
                            />
                            {errors.activities?.[index]?.organization && (
                              <p className="text-red-500 text-xs mt-1">
                                {
                                  errors.activities[index]?.organization
                                    ?.message
                                }
                              </p>
                            )}
                            <div>
                              <Label htmlFor={`activities.${index}.role`}>
                                Role/Position (Optional)
                              </Label>
                              <Input
                                id={`activities.${index}.role`}
                                placeholder="e.g., Member, Team Lead, President"
                                {...register(`activities.${index}.role`)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label
                                  htmlFor={`activities.${index}.startDate`}
                                >
                                  Start Date
                                </Label>
                                <Input
                                  id={`activities.${index}.startDate`}
                                  placeholder="e.g. Jan 2020"
                                  {...register(`activities.${index}.startDate`)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`activities.${index}.endDate`}>
                                  End Date
                                </Label>
                                <Input
                                  id={`activities.${index}.endDate`}
                                  placeholder="e.g. Present or May 2021"
                                  {...register(`activities.${index}.endDate`)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label
                                htmlFor={`activities.${index}.description`}
                              >
                                Description/Achievements (Optional)
                              </Label>
                              <Textarea
                                id={`activities.${index}.description`}
                                placeholder="Describe your responsibilities, achievements, or impact. Use new lines for bullet points."
                                {...register(`activities.${index}.description`)}
                                rows={3}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Use a new line for each bullet point.
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm" // [cite: 1]
                              className="absolute top-1 right-1 text-red-500 hover:text-red-700" // [cite: 1]
                              onClick={() => removeActivity(index)}
                            >
                              <Trash2 className="h-4 w-4" /> {/* [cite: 1] */}
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline" // [cite: 1]
                          onClick={() =>
                            appendActivity({
                              organization: "",
                              role: "",
                              description: "",
                              startDate: "",
                              endDate: "",
                            })
                          }
                          className="w-full" // [cite: 1]
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add
                          Activity/Leadership {/* [cite: 1] */}
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                    {/* Skills */}
                    <AccordionItem value="skills" className="border rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5 text-primary" />{" "}
                          Skills
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 border-t space-y-4">
                        <div>
                          <Label htmlFor="skills.programming">
                            Programming Languages (Optional)
                          </Label>
                          <Input
                            id="skills.programming"
                            {...register("skills.programming")}
                            placeholder="e.g., JavaScript, Python, Java (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.frameworks">
                            Frameworks/Libraries (Optional)
                          </Label>
                          <Input
                            id="skills.frameworks"
                            {...register("skills.frameworks")}
                            placeholder="e.g., React, Node.js, Django (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.tools">Tools (Optional)</Label>
                          <Input
                            id="skills.tools"
                            {...register("skills.tools")}
                            placeholder="e.g., Git, Docker, Figma, Jira (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.platforms">
                            Platforms (Optional)
                          </Label>
                          <Input
                            id="skills.platforms"
                            {...register("skills.platforms")}
                            placeholder="e.g., AWS, Azure, Google Cloud (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.design">
                            Design Skills (Optional)
                          </Label>
                          <Input
                            id="skills.design"
                            {...register("skills.design")}
                            placeholder="e.g., UI/UX Design, Prototyping (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.methodologies">
                            Methodologies (Optional)
                          </Label>
                          <Input
                            id="skills.methodologies"
                            {...register("skills.methodologies")}
                            placeholder="e.g., Agile, Scrum, Waterfall (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.management">
                            Management Skills (Optional)
                          </Label>
                          <Input
                            id="skills.management"
                            {...register("skills.management")}
                            placeholder="e.g., Project Management, Team Leadership (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.marketing">
                            Marketing Skills (Optional)
                          </Label>
                          <Input
                            id="skills.marketing"
                            {...register("skills.marketing")}
                            placeholder="e.g., SEO, Content Marketing (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.writing">
                            Writing Skills (Optional)
                          </Label>
                          <Input
                            id="skills.writing"
                            {...register("skills.writing")}
                            placeholder="e.g., Technical Writing, Copywriting (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.languages">
                            Spoken Languages (Optional)
                          </Label>
                          <Input
                            id="skills.languages"
                            {...register("skills.languages")}
                            placeholder="e.g., English (Native), Spanish (Fluent) (comma-separated)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.certifications">
                            Certifications (Optional)
                          </Label>
                          <Textarea
                            id="skills.certifications"
                            {...register("skills.certifications")}
                            placeholder="e.g., AWS Certified Developer - Associate (comma-separated or new lines)"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills.interests">
                            Interests/Hobbies (Optional)
                          </Label>
                          <Textarea
                            id="skills.interests"
                            {...register("skills.interests")}
                            placeholder="e.g., Photography, Hiking, Open Source (comma-separated or new lines)"
                            rows={2}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          For inputs, use commas to separate multiple items if
                          you want them listed together. For text areas, you can
                          use new lines.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Preview & Options */}
          <motion.div
            className="lg:col-span-3 card" // Removed p-6 to allow preview to manage its own padding
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 border-b flex justify-between items-center bg-muted/30 rounded-t-lg">
              <h2 className="text-xl font-semibold">Live Preview</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Template selection coming soon!")}
                >
                  <Palette className="mr-2 h-4 w-4" /> Templates
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-4 w-4" /> PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadDOCX}
                >
                  <Download className="mr-2 h-4 w-4" /> DOCX
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadTXT}>
                  <Download className="mr-2 h-4 w-4" /> TXT
                </Button>
              </div>
            </div>
            <div
              id="resume-preview-content"
              className="p-6 bg-white dark:bg-card h-[calc(100vh-12rem)] overflow-y-auto resume-preview-scrollbar"
            >
              {resumePreviewData ? (
                <ResumePreview data={resumePreviewData} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FileText size={48} className="mb-4" />
                  <p>Your resume preview will appear here.</p>
                  <p className="text-sm">
                    Fill in the details on the left and click &quot;Update
                    Preview&quot;.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <style jsx global>{`
        .resume-preview-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .resume-preview-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .resume-preview-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; // cool-gray-300
          border-radius: 4px;
        }
        .dark .resume-preview-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563; // cool-gray-600
        }
        .resume-preview-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; // cool-gray-400
        }
        .dark .resume-preview-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280; // cool-gray-500
        }
      `}</style>
    </div>
  );
};

export default ResumeGeneratorPage;
