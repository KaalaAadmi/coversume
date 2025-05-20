import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";
import { nextCookies } from "better-auth/next-js";
import { verificationSendEmail } from "../verification-emailer";
import { openAPI } from "better-auth/plugins";
import { resetSendEmail } from "../resetpass-emailer";

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Require email verification for new users
    minPasswordLength: 8, // Minimum password length
    maxPasswordLength: 64, // Maximum password length
    autoSignIn: true, // Automatically sign in users after registration
    sendResetPassword: async ({ user, url }) => {
      // Send reset password email

      await resetSendEmail({
        email: user.email,
        name: user.name,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  emailVerification: {
    sendOnSignUp: true, // Send verification email on sign up
    autoSignInAfterVerification: true, // Automatically sign in users after email verification
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.BETTER_AUTH_URL}/dashboard`;
      await verificationSendEmail({
        // name: user.name,
        name: user.name,
        email: user.email,
        subject: "Verify your email",
        url: verificationUrl,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true, // Allow users to link multiple accounts
    },
  },
  user: {
    additionalFields: {
      isPro: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },
  socialProviders: {
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [openAPI(), nextCookies()],
});
