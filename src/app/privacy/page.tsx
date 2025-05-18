"use client";
import React, { useEffect } from "react";

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = "Privacy Policy - CoverSumé";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              At CoverSumé, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website and use our services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                Personal information (name, email address, phone number)
              </li>
              <li className="mb-2">Resume content and job descriptions</li>
              <li className="mb-2">Account credentials</li>
              <li className="mb-2">Payment information</li>
              <li className="mb-2">Communication preferences</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Provide and maintain our services</li>
              <li className="mb-2">Generate personalized cover letters</li>
              <li className="mb-2">Process payments and prevent fraud</li>
              <li className="mb-2">Send administrative information</li>
              <li className="mb-2">Improve our services</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, no method
              of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to
              provide you with our services and as described in this Privacy
              Policy. We may also retain and use this information to comply with
              our legal obligations, resolve disputes, and enforce our
              agreements.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Access your personal information</li>
              <li className="mb-2">Correct inaccurate data</li>
              <li className="mb-2">Request deletion of your data</li>
              <li className="mb-2">Object to processing of your data</li>
              <li className="mb-2">Data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Changes to This Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last Updated&quot; date.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at privacy@coversume.com.
            </p>

            <p className="mt-8 text-sm text-gray-500">
              Last Updated: March 15, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
