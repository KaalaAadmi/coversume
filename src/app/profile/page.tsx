"use client";
import React, { useState, useEffect } from "react";
// import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";
import {
  User,
  // Mail,
  // Phone,
  // Globe,
  // Key,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  portfolio: string;
};
type PasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  // const [name, setName] = useState<string>(user?.name || "");
  // const [email, setEmail] = useState<string>(user?.email || "");
  // const [phone, setPhone] = useState<string>("");
  // const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  // const [currentPassword, setCurrentPassword] = useState<string>("");
  // const [newPassword, setNewPassword] = useState<string>("");
  // const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Profile - CoverGen";
    window.scrollTo(0, 0);
  }, []);

  const {
    register: registerProfile,
    formState: { errors: errorsProfile },
    handleSubmit: handleSubmitProfile,
  } = useForm<ProfileData>();

  const {
    register: registerPassword,
    formState: { errors: errorsPassword },
    handleSubmit: handleSubmitPassword,
  } = useForm<PasswordData>();

  const handleProfileUpdate = (data: ProfileData) => {
    event?.preventDefault();
    setIsSaving(true);
    const { name, email, phone, portfolio } = data;
    console.log(name, email, phone, portfolio);
    // Simulate API call to update profile
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Reset success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handlePasswordUpdate = (data: PasswordData) => {
    event?.preventDefault();
    setIsSaving(true);
    const { currentPassword, newPassword, confirmNewPassword } = data;
    console.log(currentPassword, newPassword, confirmNewPassword);
    // Validate passwords
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirmation do not match");
      setIsSaving(false);
      return;
    }
    // Simulate API call to update password
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      // setCurrentPassword("");
      // setNewPassword("");
      // setConfirmNewPassword("");

      // Reset success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="bg-gradient-to-tr from-brand-50 to-blue-50 py-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* <div className="card"> */}
            <Card className="border-b border-gray-200 px-6 py-4">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form
                  className="space-y-6"
                  onSubmit={handleSubmitProfile(handleProfileUpdate)}
                >
                  <div className="space-y-3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input type="text" id="name" {...registerProfile("name")} />
                    {/* <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-400" />
                      </div> */}
                    {errorsProfile.name && <span>This field is required</span>}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email">Email Address</Label>
                    {/* <Mail className="h-5 w-5 text-gray-400" /> */}
                    <Input
                      type="email"
                      id="email"
                      {...registerProfile("email")}
                    />
                    {errorsProfile.email && <span>This field is required</span>}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone">Phone Number</Label>
                    {/* <Phone className="h-5 w-5 text-gray-400" /> */}
                    <Input
                      type="tel"
                      id="phone"
                      {...registerProfile("phone")}
                    />
                    {errorsProfile.phone && <span>This field is required</span>}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    {/* <Globe className="h-5 w-5 text-gray-400" /> */}
                    <Input
                      type="url"
                      id="portfolio"
                      {...registerProfile("portfolio")}
                    />
                    {errorsProfile.portfolio && (
                      <span>This field is required</span>
                    )}
                  </div>
                  <div className="py-4">
                    <button
                      type="submit"
                      className="btn btn-primary px-8 py-2.5"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>

                    {saveSuccess && (
                      <div className="mt-3 flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Changes saved successfully</span>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Cards */}
          <motion.div
            className="md:col-span-1 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Account Type */}
            <Card className="w-full max-w-md border-0 shadow-card p-6">
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-bold mb-4">
                  Account Type
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <div className="bg-blue-50 text-blue-800 rounded-lg p-4 flex items-start mb-4">
                  <div className="p-1 bg-primary-100 rounded-full mr-3">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user?.isPro ? "Pro Account" : "Free Account"}
                    </p>
                    <p className="text-sm mt-1">
                      {user?.isPro
                        ? "Enjoy unlimited cover letter generation and advanced features."
                        : "Limited to 5 cover letters per month."}
                    </p>
                  </div>
                </div>
                {!user?.isPro && (
                  <a
                    href="/pricing"
                    className="btn btn-primary w-full justify-center"
                  >
                    Upgrade to Pro
                  </a>
                )}
              </CardContent>
            </Card>
            {/* <div className="card p-6">
              <h3 className="font-semibold mb-4">Account Type</h3>
              <div className="bg-blue-50 text-blue-800 rounded-lg p-4 flex items-start mb-4">
                <div className="p-1 bg-primary-100 rounded-full mr-3">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {user?.isPro ? "Pro Account" : "Free Account"}
                  </p>
                  <p className="text-sm mt-1">
                    {user?.isPro
                      ? "Enjoy unlimited cover letter generation and advanced features."
                      : "Limited to 5 cover letters per month."}
                  </p>
                </div>
              </div>

              {!user?.isPro && (
                <a
                  href="/pricing"
                  className="btn btn-primary w-full justify-center"
                >
                  Upgrade to Pro
                </a>
              )}
            </div> */}

            {/* Password Change */}
            <Card className="w-full max-w-md border-0 shadow-card p-6">
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-bold">
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={handleSubmitPassword(handlePasswordUpdate)}
                >
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      type="password"
                      id="current-password"
                      {...registerPassword("currentPassword")}
                    />
                    {errorsPassword.currentPassword && (
                      <span>This field is required</span>
                    )}
                  </div>
                  <div className="space-y-2 ">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      type="password"
                      id="new-password"
                      {...registerPassword("newPassword")}
                    />
                    {errorsPassword.newPassword && (
                      <span>This field is required</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      type="password"
                      id="confirm-password"
                      {...registerPassword("confirmNewPassword")}
                    />
                    {errorsPassword.confirmNewPassword && (
                      <span>This field is required</span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            {/* <div className="card p-6">
              <h3 className="font-semibold mb-4">Change Password</h3>
              <form onSubmit={handlePasswordUpdate}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="current-password"
                        className="pl-10 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="new-password"
                        className="pl-10 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirm-password"
                        className="pl-10 w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full justify-center py-2.5"
                    disabled={
                      isSaving ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmNewPassword ||
                      newPassword !== confirmNewPassword
                    }
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
