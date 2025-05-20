"use client";

import { useState } from "react";
import { forgetPassword } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
};

export default function ForgotPasswordPage() {
  const params = useSearchParams();
  const emailFromQuery = params.get("email") || "";
  //   const [email, setEmail] = useState(emailFromQuery);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: emailFromQuery,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // e.preventDefault();
    const { email } = data;
    const { error } = await forgetPassword({
      email,
      redirectTo: `${window.location.origin}/forgot-account/forgot-password/reset-password`, // This page will be created next
    });

    if (error) {
      setMessage("Something went wrong. Please try again.");
    } else {
      setMessage("Check your email for the reset link.");
    }
    // setEmail("");
  };

  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 max-w-md mx-auto space-y-4 container"
      >
        <h1 className="text-xl font-bold">Forgot Password?</h1>
        <Input
          type="email"
          //   required
          //   value={email}
          placeholder="Your email"
          //   onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">This field is required</span>
        )}
        <div className="grid grid-cols-3 gap-2">
          <Button type="submit">Send Reset Link</Button>
          <Button asChild variant={"outline"}>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
        {message && <p className="text-red-500 text-xs">{message}</p>}
      </form>
    </div>
  );
}
