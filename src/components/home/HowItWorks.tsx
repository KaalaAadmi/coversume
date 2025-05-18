import React from "react";
import { motion } from "framer-motion";
import { FileUp, FileText, Sparkles } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Upload Resume",
    description:
      "Upload your resume or paste its content directly into our system.",
    icon: FileUp,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    title: "Paste Job Description",
    description:
      "Add the job description you're applying for so we can tailor your letter.",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 3,
    title: "Generate Your Letter",
    description:
      "Our AI analyzes both documents and creates a personalized cover letter.",
    icon: Sparkles,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">
            Create personalized cover letters in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
              )}

              {/* Step card */}
              <div className="card p-6 relative z-10 h-full flex flex-col items-center text-center transition-all hover:shadow-card-hover">
                <div
                  className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
