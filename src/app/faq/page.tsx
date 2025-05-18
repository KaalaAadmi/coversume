"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';

const FAQ = () => {
  const faqs = [
    {
      question: "How does CoverSumé create personalized cover letters?",
      answer:
        "CoverSumé uses advanced AI algorithms to analyze your resume and the job description. It identifies the most relevant skills and experiences, then creates a professional cover letter that highlights your qualifications for the specific position. Each letter is tailored to match the company's needs and showcase your strengths.",
    },
    {
      question: "Is my data secure with CoverSumé?",
      answer:
        "Absolutely. We take data security very seriously. All your personal information, including your resume and generated cover letters, is encrypted and never shared with third parties. We only use your data to provide you with our services, and you can request deletion of your information at any time.",
    },
    {
      question: "Can I edit the generated cover letters?",
      answer:
        "Yes, you can fully edit your generated cover letters. While our AI creates a strong first draft based on your resume and the job description, you can modify any part of it to add personal touches or include additional information that you think is relevant.",
    },
    {
      question: "How does the AI generate cover letters?",
      answer:
        "Our AI analyzes your resume and the job description to identify key skills and experiences that match what employers are looking for. It then crafts a personalized cover letter using Harvard-style formatting and professional language that highlights your relevant qualifications.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use bank-level encryption for all uploaded documents. Your resume and job descriptions are processed for letter generation only and are never stored permanently on our servers unless you explicitly save them to your account.",
    },
    {
      question: "Can I edit the generated cover letters?",
      answer:
        "Yes! After generation, you can edit any part of the letter to add personal touches or make adjustments. Our Pro plan also offers advanced tone controls to fine-tune how formal or conversational your letter sounds.",
    },
    {
      question: "How many cover letters can I create?",
      answer:
        "Free users can generate up to 5 cover letters per month. Pro subscribers ($9.99/month) get unlimited cover letter generation, plus additional features like the application tracker and advanced letter refinement tools.",
    },
    {
      question:
        "What format options are available for downloading my cover letter?",
      answer:
        "You can download your cover letter as a PDF, DOCX (Microsoft Word), or plain text file. Pro users also get access to markdown format export.",
    },
    {
      question: "Do you offer student discounts?",
      answer:
        "Yes! Students with valid ID can receive a 50% discount on our Pro plan. Simply sign up for a Pro account and then verify your student status through our verification partner.",
    },
    {
      question: "How accurate is the AI at matching job requirements?",
      answer:
        "Our AI has been trained on thousands of successful cover letters and job descriptions across various industries. It's highly effective at identifying relevant skills and experiences from your resume that match job requirements. However, we always recommend reviewing the generated letter and making any necessary adjustments to ensure it accurately represents you.",
    },
    {
      question: "Can I generate cover letters in languages other than English?",
      answer:
        "Currently, we support English (US), English (UK), Spanish, French, and German. We're working on adding more languages in the future.",
    },
    {
      question: "What is the Application Tracker feature?",
      answer:
        "The Application Tracker is available to Pro subscribers and helps you keep track of all your job applications. You can record application status, interview dates, follow-up tasks, and notes for each position you apply to.",
    },
    {
      question: "How can I cancel my subscription?",
      answer:
        "You can cancel your Pro subscription at any time from your account settings page. Your subscription will remain active until the end of your current billing period.",
    },
    {
      question: "Is there a browser extension available?",
      answer:
        "Yes, Pro users get access to our browser extension for Chrome and Firefox. The extension allows you to quickly generate cover letters while browsing job listings without having to copy-paste job descriptions.",
    },
    {
      question:
        "What happens if I'm not satisfied with my generated cover letter?",
      answer:
        "We offer unlimited regenerations, even for free users. If you're not happy with a generated letter, you can adjust your inputs or use our refinement tools to get different results. Pro users also get access to more advanced refinement options.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-28 pb-16">
      {/* <Navbar /> */}
      <div className="container-custom w-full rounded">
        <main className="flex-grow bg-gray-50 ">
          <section className="bg-gradient-to-tr from-brand-50 to-blue-50 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600">
                Everything you need to know about our cover letter generator
              </p>
            </div>
          </section>

          <section className="py-8">
            <motion.div
              className="max-w-3xl mx-auto card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="p-6 sm:p-8">
                <Accordion type="single" collapsible className="space-y-6">
                  {faqs.map((item, index) => (
                    <AccordionItem
                      value={`item-${index}`}
                      key={index}
                      className="card-shadow border-none  rounded"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-12 text-center rounded-2xl bg-primary-50">
                  <h3 className="text-xl font-medium mb-4">
                    Still have questions?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We&apos;re here to help! Contact our support team and
                    we&apos;ll get back to you as soon as possible.
                  </p>
                  <a
                    href="mailto:support@coversume.com"
                    className="text-brand-600 font-medium hover:underline"
                  >
                    support@coversume.com
                  </a>
                </div>
              </div>
            </motion.div>
            {/* <div className="container mx-auto px-4 max-w-3xl">
              <Accordion type="single" collapsible className="space-y-6">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    value={`item-${index}`}
                    key={index}
                    className="card-shadow border-none  rounded"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-12 text-center rounded-2xl bg-primary-50">
                <h3 className="text-xl font-medium mb-4">
                  Still have questions?
                </h3>
                <p className="text-gray-600 mb-6">
                  We&apos;re here to help! Contact our support team and
                  we&apos;ll get back to you as soon as possible.
                </p>
                <a
                  href="mailto:support@coversume.com"
                  className="text-brand-600 font-medium hover:underline"
                >
                  support@coversume.com
                </a>
              </div>
            </div> */}
          </section>
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default FAQ;
