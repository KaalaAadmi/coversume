import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// import { Link } from 'react-router-dom';

const CTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold sm:text-4xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Land Your Dream Job?
          </motion.h2>

          <motion.p
            className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Create your first Harvard-style cover letter in minutes and increase
            your chances of getting called for an interview.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              href="/register"
              className="btn bg-white text-primary-700 hover:bg-gray-100 focus:ring-white px-8 py-3 text-base font-medium"
            >
              Get Started for Free
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
