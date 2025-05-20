"use client";
import React, { useState, useEffect } from "react";
// import {  useLocation } from "react-dom";
import { usePathname } from "next/navigation";

// import { useAuth } from "../../context/AuthContext";
import { Menu, X, FileText, ChevronDown } from "lucide-react";
import Link from "next/link";
import SignOutButton from "../sign-out-button";
import { useSession } from "@/lib/auth/auth-client";

const Navbar: React.FC = () => {
  // console.log(data, "session in navbar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  // const [session, setSession] = useState(null);
  // const { isAuthenticated, user, logout } = useAuth();
  const location = usePathname();

  const { data: session } = useSession();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    // const getSessionData = async () => {
    //   const data = await fetch(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/get-session`
    //   );
    //   if (data.ok) {
    //     const sessionData = await data.json();
    //     if (sessionData) {
    //       setSession(sessionData.session);
    //       setUser(sessionData.user);
    //     }
    //     // console.log(sessionData.user, "data in navbar");
    //   }
    // };
    // getSessionData();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // console.log(session, "session in navbar");
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);
  //   }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-semibold text-xl"
          >
            <FileText className="h-7 w-7 text-primary-600" />
            <span className={isScrolled ? "text-gray-900" : "text-gray-900"}>
              CoverSumé
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                location === "/"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors ${
                location === "/pricing"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${
                location === "/blog"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/faq"
              className={`text-sm font-medium transition-colors ${
                location === "/faq"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${
                location === "/contact"
                  ? "text-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session !== null ? (
              <div className="relative group">
                <button className="btn btn-outline flex items-center space-x-1 pr-8">
                  <span>{session.user?.name}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/generator"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Generate Letter
                  </Link>
                  <Link
                    href="/history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Saved Letters
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {/* <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button> */}
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline">
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-2 space-y-3 bg-white">
            <Link
              href="/"
              className={`block py-2 px-3 rounded-lg text-base font-medium ${
                location === "/"
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`block py-2 px-3 rounded-lg text-base font-medium ${
                location === "/pricing"
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Pricing
            </Link>
            <div className="pt-4 border-t border-gray-200">
              {session !== null ? (
                <>
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">
                    Signed in as {session.user?.email}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block py-2 px-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/generator"
                    className="block py-2 px-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Generate Letter
                  </Link>
                  <Link
                    href="/profile"
                    className="block py-2 px-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  {/* <button
                    onClick={logout}
                    className="block w-full text-left py-2 px-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign out
                  </button> */}
                  <SignOutButton />
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block py-2 px-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 px-3 rounded-lg text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
