"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Inputs = {
  password: string;
  confirmPassword: string;
};
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
    }
  }, [token]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // e.preventDefault();

    if (!token) return;
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
    }
    const { error } = await resetPassword({
      token,
      newPassword: password,
    });

    if (error) {
      toast.error("Failed to reset password.");
    } else {
      toast.success("Password reset! You can now sign in.");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 max-w-md mx-auto space-y-4 container"
      >
        <h1 className="text-xl font-bold">Reset Password</h1>
        {message && <p className="text-red-500 text-xs">{message}</p>}
        <div>
          <Label htmlFor="password" className="block mb-2">
            New Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="New password"
            // required
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>
        <div>
          <Label htmlFor="confirm-password" className="block mb-2">
            Confirm New Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm New password"
            // required
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
        </div>
        <Button type="submit">Reset Password</Button>
      </form>
    </div>
  );
}
