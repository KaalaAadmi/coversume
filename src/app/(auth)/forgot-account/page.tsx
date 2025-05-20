"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { searchAccount } from "@/lib/actions";
import { SubmitHandler, useForm } from "react-hook-form";
import { searchAccount } from "@/lib/actions";
type Inputs = {
  email: string;
};
export default function ForgotAccountPage() {
  //   const [email, setEmail] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const handleSearch: SubmitHandler<Inputs> = async (data) => {
    // e.preventDefault();
    const { email } = data;
    const found = await searchAccount(email);
    if (found) {
      router.push(
        `/forgot-account/forgot-password?email=${encodeURIComponent(email)}`
      );
    } else {
      router.push("/register");
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(handleSearch)}
        className="p-6 max-w-md mx-auto space-y-4 container"
      >
        <h1 className="text-xl font-semibold">Find Your Account</h1>
        <Input
          type="email"
          placeholder="Enter your email"
          // value={email}

          // onChange={(e) => setEmail(e.target.value)}
          // required

          className="w-full p-2 border rounded"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">This field is required</span>
        )}
        <Button type="submit">Search</Button>
      </form>
    </div>
  );
}
