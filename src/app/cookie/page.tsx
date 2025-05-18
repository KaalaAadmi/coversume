"use client";
import React, { useEffect } from "react";

const CookiePolicy: React.FC = () => {
  useEffect(() => {
    document.title = "Cookie Policy - CoverSumé";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              This Cookie Policy explains how CoverSumé uses cookies and similar
              technologies to recognize you when you visit our website. It
              explains what these technologies are and why we use them, as well
              as your rights to control our use of them.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              What are cookies?
            </h2>
            <p className="mb-4">
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners in order to make their websites work, or to work
              more efficiently, as well as to provide reporting information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              How do we use cookies?
            </h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                Essential cookies: Required for the operation of our website
              </li>
              <li className="mb-2">
                Analytics cookies: Help us understand how visitors interact with
                our website
              </li>
              <li className="mb-2">
                Preference cookies: Enable the website to remember your
                preferences
              </li>
              <li className="mb-2">
                Marketing cookies: Track your activity across websites to
                deliver targeted advertising
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              How can you control cookies?
            </h2>
            <p className="mb-4">
              You can set or amend your web browser controls to accept or refuse
              cookies. If you choose to reject cookies, you may still use our
              website though your access to some functionality and areas of our
              website may be restricted.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Updates to this policy
            </h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time in order to
              reflect changes to the cookies we use or for other operational,
              legal, or regulatory reasons. Please revisit this Cookie Policy
              regularly to stay informed about our use of cookies and related
              technologies.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact us</h2>
            <p>
              If you have any questions about our use of cookies or other
              technologies, please email us at privacy@coversume.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
