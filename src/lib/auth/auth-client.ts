import { createAuthClient } from "better-auth/react";
// import { emailOTPClient } from "better-auth/client/plugins";

export const {
  signIn,
  signOut,
  useSession,
  getSession,
  forgetPassword,
  resetPassword,
  // emailOtp,
} = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  // plugins: [emailOTPClient()],
});
