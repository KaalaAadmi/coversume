import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";
// import { Link } from 'react-router-dom';

const PricingTeaser: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the plan that works best for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            className="card overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">
                    5 cover letters per month
                  </span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Custom inputs</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Markdown export</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Resume encryption</span>
                </li>
                <li className="flex">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Letter refinement</span>
                </li>
                <li className="flex">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Application tracker</span>
                </li>
              </ul>

              <Link
                href="/register"
                className="btn btn-outline w-full justify-center"
              >
                Try for Free
              </Link>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="card overflow-hidden border-2 border-primary-500 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0">
              <div className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">
                    <strong>Unlimited</strong> cover letters
                  </span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Custom inputs</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Letter refinement</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Application tracker</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Markdown & PDF export</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">
                    Student discount (50% off)
                  </span>
                </li>
              </ul>

              <Link
                href="/register"
                className="btn btn-primary w-full justify-center"
              >
                Upgrade to Pro
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/pricing"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            View Full Pricing Details
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
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

export default PricingTeaser;
