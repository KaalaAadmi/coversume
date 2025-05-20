"use server";

import { APIError } from "better-auth/api";
import { auth } from "./auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

interface State {
  errorMessage?: string | null;
  message?: string | null;
}

export async function signUp(prevState: State, formData: FormData) {
  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstname: formData.get("firstname") as string,
    lastname: formData.get("lastname") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    isPro: false,
  };
  const { email, password, firstname, lastname, confirmPassword, isPro } =
    rawFormData;
  if (!email || !password || !firstname || !lastname || !confirmPassword) {
    return { errorMessage: "All fields are required." };
  }
  if (password !== confirmPassword) {
    return { errorMessage: "Passwords do not match." };
  }
  if (password.length < 8) {
    return { errorMessage: "Password must be at least 8 characters long." };
  }
  try {
    await auth.api.signUpEmail({
      body: {
        name: `${firstname} ${lastname}`,
        email,
        password,
        isPro,
      },
    });
    return {
      message:
        "Verification email sent. Please check your inbox for the next steps.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "User already exists." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid email." };
        default:
          return { errorMessage: "An unexpected error occurred." };
      }
    }
    console.log("sign up with email and password has not worked:", error);
  }
  // redirect(`/register/verify?email=${encodeURIComponent(email)}`);
}

export async function signIn(prevState: State, formData: FormData) {
  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { email, password } = rawFormData;
  if (!email || !password) {
    return { errorMessage: "All fields are required." };
  }
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return { errorMessage: "User not found." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid email." };
        default:
          return { errorMessage: "An unexpected error occurred." };
      }
    }
    console.log("sign in with email and password has not worked:", error);
  }
  redirect("/dashboard");
}

export async function searchAccount(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return !!user;
}
