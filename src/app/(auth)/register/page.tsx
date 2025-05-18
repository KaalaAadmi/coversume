"use client";
import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  //   CardHeader,
  //   CardTitle,
  //   CardDescription,
  //   CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, FileText, Github } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const Register = () => {
  //   const [name, setName] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    document.title = "Create Account - CoverSumé";

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    event?.preventDefault();
    setError("");

    const { firstname, lastname, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const name = firstname + " " + lastname;
    try {
      await signup(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center pt-24 sm:pt-16 sm:px-6 lg:px-8">
      <div className="container-custom w-full rounded">
        <main className="flex-grow bg-gray-50 ">
          <section className="bg-gradient-to-tr from-brand-50 to-blue-50 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Link href="/" className="flex items-center justify-center">
                <FileText className="h-12 w-12 text-primary-600" />
              </Link>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Create your account
              </h1>
              <p className="text-xl text-gray-600">
                Or{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  sign in to your existing account
                </Link>
              </p>
            </div>
          </section>
        </main>
      </div>
      <main className="flex-grow flex items-center justify-center pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-md border-0 shadow-card">
          {/* <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                Create an account
              </CardTitle>
              <CardDescription>
                Enter your details to create a new account
              </CardDescription>
            </CardHeader> */}
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button
                  variant={"outline"}
                  //   className="btn btn-outline py-2.5 w-full inline-flex justify-center items-center text-gray-700"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    // required
                    {...register("firstname")}
                  />
                  {errors.firstname && <span>This field is required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    // required
                    {...register("lastname")}
                  />
                  {errors.lastname && <span>This field is required</span>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  //   required
                  {...register("email")}
                />
                {errors.email && <span>This field is required</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  //   required
                  {...register("password")}
                />
                {errors.password && <span>This field is required</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  //   required
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && <span>This field is required</span>}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    // className="text-brand-600 hover:underline"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    // className="text-brand-600 hover:underline"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full justify-center py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
            </form>
          </CardContent>
          {/* <CardFooter className="border-t pt-4 text-center">
            <p className="px-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline hover:text-brand-600 transition-colors text-sm font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter> */}
        </Card>
      </main>
      {/* <Footer /> */}
      {/* </div> */}
    </div>
  );
};

export default Register;
