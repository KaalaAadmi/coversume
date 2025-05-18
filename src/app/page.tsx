"use client";
import CTA from "@/components/home/CTA";
import FAQ from "@/components/home/FAQ";
import FeatureCards from "@/components/home/FeatureCards";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PreviewGenerator from "@/components/home/PreviewGenerator";
import PricingTeaser from "@/components/home/PricingTeaser";
import Testimonials from "@/components/home/Testimonials";
import React, { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    // Update page title
    document.title = "CoverSume - We Write. You Rise.";

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="pt-16">
      <Hero />
      <HowItWorks />
      <FeatureCards />
      <PreviewGenerator />
      <Testimonials />
      <PricingTeaser />
      <FAQ />
      <CTA />
    </div>
  );
};

export default HomePage;
