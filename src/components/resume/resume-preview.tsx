// in components/resume/ResumePreview.tsx

import { ResumeFormData } from "@/app/resume-generator/page";
import React from "react";
// import { type ResumeFormData } from "@/app/resume-generator"; // Import the type
import { format, parse } from "date-fns"; // You'll need to install date-fns: npm install date-fns

interface ResumePreviewProps {
  data: ResumeFormData;
}

// Helper function to parse and format dates or return original if invalid/empty
const formatDisplayDate = (dateString?: string): string => {
  if (!dateString || dateString.toLowerCase() === "present") {
    return dateString || "";
  }
  try {
    // Attempt to parse common formats, e.g., "Jan 2020", "January 2020", "2020-01"
    // date-fns is flexible but be specific if users enter varied formats
    const datePatterns = ["MMM yyyy", "MMMM yyyy", "yyyy-MM", "MM/yyyy"];
    let parsedDate: Date | null = null;
    for (const pattern of datePatterns) {
      const d = parse(dateString, pattern, new Date());
      if (!isNaN(d.valueOf())) {
        parsedDate = d;
        break;
      }
    }
    if (parsedDate && !isNaN(parsedDate.valueOf())) {
      return format(parsedDate, "MMM yyyy");
    }
  } catch (e) {
    // Fallback to original string if parsing fails
  }
  return dateString;
};

// Helper to parse graduation date for sorting
const parseGraduationDateForSort = (dateString?: string): Date => {
  if (!dateString) return new Date(0); // very past date for undefined
  if (dateString.toLowerCase() === "present") return new Date(); // current date for present

  try {
    const datePatterns = ["MMM yyyy", "MMMM yyyy", "yyyy-MM", "MM/yyyy"];
    for (const pattern of datePatterns) {
      const d = parse(dateString, pattern, new Date());
      if (!isNaN(d.valueOf())) return d;
    }
  } catch (e) {
    /* ignore */
  }
  return new Date(0); // Fallback for unparseable dates
};

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  // Sort education and experiences by date in descending order for preview
  const sortedEducation = data.education
    ? [...data.education].sort((a, b) => {
        const dateA = parseGraduationDateForSort(a.graduationDate);
        const dateB = parseGraduationDateForSort(b.graduationDate);
        return dateB.getTime() - dateA.getTime();
      })
    : [];

  const sortedExperiences = data.experiences
    ? [...data.experiences].sort((a, b) => {
        const dateA = parseGraduationDateForSort(a.endDate); // Assuming endDate determines order
        const dateB = parseGraduationDateForSort(b.endDate);
        return dateB.getTime() - dateA.getTime();
      })
    : [];

  const sortedActivities = data.activities
    ? [...data.activities].sort((a, b) => {
        const dateA = parseGraduationDateForSort(a.endDate); // Using the same sorting logic as education/experience
        const dateB = parseGraduationDateForSort(b.endDate);
        return dateB.getTime() - dateA.getTime();
      })
    : [];
  // Helper to format skill category names for display
  const formatSkillCategoryName = (categoryKey: string): string => {
    if (categoryKey === "programming") return "Programming";
    if (categoryKey === "frameworks") return "Frameworks";
    if (categoryKey === "languages") return "Languages"; // Assuming this is for spoken languages
    // Capitalize first letter and replace camelCase with spaces for other keys
    return categoryKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Filter out empty skill categories
  const skillCategories = data.skills
    ? Object.entries(data.skills)
        .filter(([_, value]) => value && value.trim() !== "")
        .map(([key, value]) => ({
          category: formatSkillCategoryName(key),
          items: value!
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s), // Split and clean up skills
        }))
        .filter((cat) => cat.items.length > 0) // Ensure category has items after splitting
    : [];

  return (
    <>
      <div className="text-sm font-sans text-black">
        {" "}
        {/* Using a basic font */}
        {/* 0. Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">{data.fullName}</h1>
          <div className="text-xs space-x-2">
            <span>
              <a href={`mailto:${data.email}`}>{data.email}</a>
            </span>
            {data.phoneNumber && (
              <span>
                |{" "}
                <a href={`tel:${data.phoneNumber.split(" ").join("")}`}>
                  {data.phoneNumber}
                </a>
              </span>
            )}
            {data.linkedin && (
              <span>
                |{" "}
                <a href={data.linkedin} className="underline">
                  LinkedIn
                </a>
              </span>
            )}
            {data.portfolio && (
              <span>
                |{" "}
                <a href={data.portfolio} className="underline">
                  Portfolio
                </a>
              </span>
            )}
            {/* Add other links */}
          </div>
        </div>
        {/* 1. Summary Section */}
        {data.summary && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-700 pb-1 mb-2 text-gray-700">
              Summary
            </h2>
            <p className="whitespace-pre-wrap text-xs">{data.summary}</p>
          </section>
        )}
        {/* 2. Education Section */}
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1">
            Education
          </h2>
          {sortedEducation?.map((edu, index) => (
            <div key={index} className="mt-2">
              <div className="flex justify-between">
                <p className="font-bold">
                  {edu.school}
                  {edu.location && ` ${edu.location}`}
                </p>
                <p className="italic">
                  {formatDisplayDate(edu.graduationDate)}
                </p>
              </div>
              <p className="italic">{edu.degree}</p>
              {/* You can add description here */}
              {edu.grade && (
                <p className="text-xs mt-1">
                  <span className="font-semibold">Grade:</span> {edu.grade}
                </p>
              )}

              {edu.description && (
                <p className="text-xs mt-1">
                  <span className="font-semibold">Related Coursework:</span>{" "}
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </section>
        {/* 3. Experience Section */}
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1">
            Experience
          </h2>
          {sortedExperiences?.map((exp, index) => (
            <div key={index} className="mt-2">
              <div className="flex justify-between">
                <p className="font-bold">{exp.company}</p>
                <p className="italic">
                  {formatDisplayDate(exp.startDate)} -{" "}
                  {formatDisplayDate(exp.endDate)}
                </p>
              </div>
              <p className="italic">{exp.jobTitle}</p>
              <ul className="list-disc list-inside mt-1 text-xs">
                {exp.description
                  ?.split("\n")
                  .map((item, i) => item.trim() && <li key={i}>{item}</li>)}
              </ul>
            </div>
          ))}
        </section>
        {/* 4. Project Section */}
        <section className="mb-3">
          {data.projects && data.projects.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-700 pb-1 mb-2 text-gray-700">
                Projects
              </h2>
              {data.projects?.map((proj, index) => (
                <div key={index} className="mt-2">
                  <div className="flex justify-between">
                    <p className="font-bold">
                      {proj.link ? (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black no-underline"
                        >
                          {proj.name}
                        </a>
                      ) : (
                        <span>{proj.name}</span>
                      )}
                    </p>
                    <p className="italic">
                      {formatDisplayDate(proj.startDate)} -{" "}
                      {formatDisplayDate(proj.endDate)}
                    </p>
                  </div>
                  <p className="italic">{proj.role}</p>
                  <ul className="list-disc list-inside mt-1 text-xs">
                    {proj.description
                      ?.split("\n")
                      .map((item, i) => item.trim() && <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))}
              {/* {data.projects.map((proj, index) => (
                <div key={index} className="mb-3">
                  <h3 className="text-md font-semibold">{proj.name}</h3>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline break-all"
                    >
                      {proj.link}
                    </a>
                  )}
                  {proj.description && (
                    <ul className="list-disc list-outside pl-5 mt-1 text-xs space-y-0.5">
                      {proj.description
                        .split("\n")
                        .map(
                          (item, i) =>
                            item.trim() && <li key={i}>{item.trim()}</li>
                        )}
                    </ul>
                  )}
                </div>
              ))} */}
            </section>
          )}
        </section>
        {/* Activities */}
        {sortedActivities.length > 0 && (
          <section className="mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-700 pb-1 mb-2 text-gray-700">
              Activities & Leadership
            </h2>
            {sortedActivities.map((activity, index) => (
              <div key={index} className="mt-2 mb-3">
                <div className="flex justify-between">
                  <p className="font-bold">{activity.organization}</p>
                  <p className="italic text-xs">
                    {formatDisplayDate(activity.startDate)} -{" "}
                    {formatDisplayDate(activity.endDate)}
                  </p>
                </div>
                {activity.role && (
                  <p className="italic text-sm">{activity.role}</p>
                )}
                {activity.description && (
                  <ul className="list-disc list-inside mt-1 text-xs space-y-0.5">
                    {activity.description
                      .split("\n")
                      .map(
                        (item, i) =>
                          item.trim() && <li key={i}>{item.trim()}</li>
                      )}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        {/* 5. Skills */}
        {skillCategories.length > 0 && (
          <section className="mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-700 pb-1 mb-2 text-gray-700">
              Skills
            </h2>
            {skillCategories.map(({ category, items }) => (
              <div key={category} className="flex">
                <h3 className="text-xs font-semibold text-gray-700 mr-1">
                  {category}
                  {": "}
                </h3>
                <p className="text-xs text-gray-600">{items.join(" • ")}</p>
              </div>
            ))}
          </section>
        )}
        {/* Add other sections (Projects, Skills) in a similar fashion */}
      </div>
    </>
  );
};
