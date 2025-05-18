import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, FileDown, PenTool } from "lucide-react";

const features = [
  {
    title: "Smart Tone Control",
    description:
      "Adjust the tone of your letter to match the company culture and job requirements.",
    icon: PenTool,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Harvard-Style Formatting",
    description:
      "Our cover letters follow the prestigious Harvard Business School format that recruiters love.",
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Multiple Export Options",
    description:
      "Download your cover letter as PDF, DOCX, or Markdown with a single click.",
    icon: FileDown,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    title: "Secure Data Handling",
    description:
      "Your resume and generated letters are encrypted and never shared with third parties.",
    icon: Shield,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

const FeatureCards: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Why Choose CoverSumé
          </h2>
          <p className="text-lg text-gray-600">
            Our platform provides everything you need to create impressive cover
            letters that get you noticed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="card overflow-hidden h-full transition-all hover:shadow-card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-6 sm:p-8 h-full">
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
