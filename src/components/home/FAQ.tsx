"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "How does CoverGen create personalized cover letters?",
    answer:
      "CoverGen uses advanced AI algorithms to analyze your resume and the job description. It identifies the most relevant skills and experiences, then creates a professional cover letter that highlights your qualifications for the specific position. Each letter is tailored to match the company's needs and showcase your strengths.",
  },
  {
    question: "Is my data secure with CoverGen?",
    answer:
      "Absolutely. We take data security very seriously. All your personal information, including your resume and generated cover letters, is encrypted and never shared with third parties. We only use your data to provide you with our services, and you can request deletion of your information at any time.",
  },
  {
    question: "Can I edit the generated cover letters?",
    answer:
      "Yes, you can fully edit your generated cover letters. While our AI creates a strong first draft based on your resume and the job description, you can modify any part of it to add personal touches or include additional information that you think is relevant.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  toggleOpen,
}) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="flex w-full justify-between items-center py-5 text-left focus:outline-none"
        onClick={toggleOpen}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our platform.
          </p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="p-6 sm:p-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                toggleOpen={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/faq"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            View All FAQs
            <svg
              className="ml-1 w-4 h-4"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
