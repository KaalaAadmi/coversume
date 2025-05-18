"use client";
import React, { useEffect } from "react";
// import { Link } from 'react-router-dom';
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingPage: React.FC = () => {
  useEffect(() => {
    document.title = "Pricing - CoverSumé";
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "What happens when I reach my monthly limit on the free plan?",
      answer:
        "Once you reach the 5 cover letter limit on the free plan, you'll need to wait until the next month for your limit to reset or upgrade to Pro for unlimited access.",
    },
    {
      question: "Can I cancel my Pro subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. Your Pro access will continue until the end of the current billing period, after which your account will revert to the free plan.",
    },
    {
      question: "How do I verify for the student discount?",
      answer:
        "After signing up for a Pro account, you can verify your student status by uploading a valid student ID or using your .edu email address. Once verified, we'll apply a 50% discount to your subscription.",
    },
    {
      question: "Do you offer team or enterprise plans?",
      answer:
        "Yes, we offer special rates for career centers, educational institutions, and enterprise customers. Please contact our sales team at sales@coversume.com for custom pricing.",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col pt-28 pb-16">
      <div className="container-custom w-full rounded">
        <main className="flex-grow bg-gray-50 ">
          <section className="bg-gradient-to-tr from-brand-50 to-blue-50 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600">
                Choose the plan that works best for your needs
              </p>
            </div>
          </section>

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              className="card overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-gray-500">/month</span>
                  <p className="text-gray-500 mt-1">No credit card required</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      <strong>5</strong> cover letters per month
                    </span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Custom inputs</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Markdown export</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Resume encryption</span>
                  </li>
                  <li className="flex">
                    <X className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Letter refinement</span>
                  </li>
                  <li className="flex">
                    <X className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Application tracker</span>
                  </li>
                  <li className="flex">
                    <X className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">PDF & DOCX export</span>
                  </li>
                  <li className="flex">
                    <X className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Priority support</span>
                  </li>
                </ul>

                <Link
                  href="/register"
                  className="btn btn-outline w-full justify-center py-3 text-base"
                >
                  Try for Free
                </Link>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="card overflow-hidden border-2 border-primary-500 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute top-0 right-0">
                <div className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">$9.99</span>
                  <span className="text-gray-500">/month</span>
                  <p className="text-gray-500 mt-1">
                    Billed monthly, cancel anytime
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      <strong>Unlimited</strong> cover letters
                    </span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Custom inputs</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      Advanced letter refinement
                    </span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Application tracker</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      Markdown, PDF & DOCX export
                    </span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">Priority support</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      Resume & data encryption
                    </span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">
                      Student discount (50% off with ID)
                    </span>
                  </li>
                </ul>

                <Link
                  href="/register"
                  className="btn btn-primary w-full justify-center py-3 text-base"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-24">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="card p-8 space-y-6">
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
            </div>
          </div>

          {/* Money-back guarantee */}
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-primary-800 mb-2">
                100% Satisfaction Guarantee
              </h3>
              <p className="text-primary-700">
                Try CoverSumé Pro risk-free with our 14-day money-back
                guarantee. If you&apos;re not satisfied, we&apos;ll refund your
                subscription — no questions asked.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PricingPage;
