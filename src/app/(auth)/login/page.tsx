// "use client";
// import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// import { AlertCircle, FileText, Linkedin } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { SubmitHandler, useForm } from "react-hook-form";

// type Inputs = {
//   email: string;
//   password: string;
// };

// const LoginPage: React.FC = () => {
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { login, isAuthenticated } = useAuth();
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<Inputs>();

//   useEffect(() => {
//     document.title = "Sign In - CoverSumé";

//     // If already authenticated, redirect to dashboard
//     if (isAuthenticated) {
//       router.push("/dashboard");
//     }
//   }, [isAuthenticated, router]);

//   const onSubmit: SubmitHandler<Inputs> = async (data) => {
//     setError("");
//     setIsLoading(true);
//     const { email, password } = data;
//     try {
//       await login(email, password);
//       router.push("/dashboard");
//     } catch (err) {
//       setError("Invalid email or password. Please try again.");
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col justify-center pt-12 sm:pt-16 sm:px-6 mx-0">
//       {/* <div className=" w-full bg-gradient-to-tr from-brand-50 to-blue-50 sm:mx-auto sm:w-full sm:max-w-md pt-12">
//         <Link href="/" className="flex items-center justify-center">
//           <FileText className="h-12 w-12 text-primary-600" />
//         </Link>
//         <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
//           Sign in to your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{" "}
//           <Link
//             href="/register"
//             className="font-medium text-primary-600 hover:text-primary-500"
//           >
//             create a new account
//           </Link>
//         </p>
//       </div> */}
//       <div className="container-custom w-full rounded">
//         <main className="flex-grow bg-gray-50 ">
//           <section className="bg-gradient-to-tr from-brand-50 to-blue-50 py-16">
//             <div className="max-w-3xl mx-auto text-center mb-16">
//               <Link href="/" className="flex items-center justify-center">
//                 <FileText className="h-12 w-12 text-primary-600" />
//               </Link>
//               <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
//                 Sign in to your account
//               </h1>
//               <p className="text-xl text-gray-600">
//                 Or{" "}
//                 <Link
//                   href="/register"
//                   className="font-medium text-primary-600 hover:text-primary-500"
//                 >
//                   create a new account
//                 </Link>{" "}
//               </p>
//             </div>
//           </section>
//         </main>
//       </div>
//       {/* <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="card py-8 px-4 sm:px-10">
//           {error && (
//             <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
//               <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
//               <p className="text-sm">{error}</p>
//             </div>
//           )}

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email address
//               </label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="input pl-10"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   className="input pl-10"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor="remember-me"
//                   className="ml-2 block text-sm text-gray-700"
//                 >
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <a
//                   href="#"
//                   className="font-medium text-primary-600 hover:text-primary-500"
//                 >
//                   Forgot your password?
//                 </a>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="btn btn-primary w-full justify-center py-2.5"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                     Signing in...
//                   </div>
//                 ) : (
//                   "Sign in"
//                 )}
//               </button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 className="btn btn-outline py-2.5 w-full inline-flex justify-center items-center text-gray-700"
//               >
//                 <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
//                   <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
//                     <path
//                       fill="#4285F4"
//                       d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
//                     />
//                     <path
//                       fill="#34A853"
//                       d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
//                     />
//                     <path
//                       fill="#FBBC05"
//                       d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
//                     />
//                     <path
//                       fill="#EA4335"
//                       d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
//                     />
//                   </g>
//                 </svg>
//                 Google
//               </button>

//               <button
//                 type="button"
//                 className="btn btn-outline py-2.5 w-full inline-flex justify-center items-center text-gray-700"
//               >
//                 <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
//                   <path d="M19.7 4.3c-.2.1-.5.1-.8.1h-1.6c.6 0 1.1.5 1.1 1.1v4.6c0 .6-.5 1.1-1.1 1.1-1.6 0-2.8-1.1-2.8-2.6 0-1.7 1.2-2.9 2.9-2.9h2.3v-1.3zm-3.3 0c-2.3 0-4.3 1.9-4.3 4.3 0 2.3 1.9 4.2 4.3 4.2h4.2v-8.5h-4.2zm-11.1 0v4.4h4.4v-4.4h-4.4zm15.3 0v4.4h4.4v-4.4h-4.4zm-11.1 15.3v4.4h4.4v-4.4h-4.4zm0-7.6v4.4h4.4v-4.4h-4.4zm7.6 0v4.4h4.4v-4.4h-4.4zm7.6 0v4.4h4.4v-4.4h-4.4zm-15.2 0v4.4h4.4v-4.4h-4.4z" />
//                 </svg>
//                 LinkedIn
//               </button>
//             </div>
//           </div>
//         </div>
//       </div> */}
//       <main className="flex-grow flex items-center justify-center pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <Card className="w-full max-w-md border-0 shadow-card">
//           {/* <CardHeader className="space-y-1 text-center">
//               <CardTitle className="text-2xl font-bold">
//                 Create an account
//               </CardTitle>
//               <CardDescription>
//                 Enter your details to create a new account
//               </CardDescription>
//             </CardHeader> */}
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant="outline" className="w-full">
//                   <Linkedin className="mr-2 h-4 w-4" />
//                   LinkedIn
//                 </Button>
//                 <Button
//                   variant={"outline"}
//                   //   className="btn btn-outline py-2.5 w-full inline-flex justify-center items-center text-gray-700"
//                 >
//                   <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
//                     <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
//                       <path
//                         fill="#4285F4"
//                         d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
//                       />
//                       <path
//                         fill="#34A853"
//                         d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
//                       />
//                       <path
//                         fill="#FBBC05"
//                         d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
//                       />
//                       <path
//                         fill="#EA4335"
//                         d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
//                       />
//                     </g>
//                   </svg>
//                   Google
//                 </Button>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-white px-2 text-muted-foreground">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>
//             </div>
//             {error && (
//               <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
//                 <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
//                 <p className="text-sm">{error}</p>
//               </div>
//             )}
//             <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   placeholder="name@example.com"
//                   type="email"
//                   //   required
//                   {...register("email")}
//                 />
//                 {errors.email && <span>This field is required</span>}
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="password">Password</Label>
//                   <Link
//                     href="/forgot-password"
//                     className="text-sm text-brand-600 hover:underline"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <Input
//                   id="password"
//                   placeholder="••••••••"
//                   type="password"
//                   //   required
//                   {...register("password")}
//                 />
//                 {errors.password && <span>This field is required</span>}{" "}
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox id="remember" />
//                 <Label
//                   htmlFor="remember"
//                   className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   Remember me
//                 </Label>
//               </div>
//               <div>
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-full justify-center py-2.5"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center">
//                       <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                       Signing in...
//                     </div>
//                   ) : (
//                     "Sign in"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </CardContent>
//           {/* <CardFooter className="border-t pt-4 text-center">
//             <p className="px-6 text-center text-sm text-muted-foreground">
//               Already have an account?{" "}
//               <Link
//                 href="/login"
//                 className="underline hover:text-brand-600 transition-colors text-sm font-medium"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </CardFooter> */}
//         </Card>
//       </main>
//     </div>
//   );
// };

// export default LoginPage;

"use client";
import SignInSocial from "@/components/sign-in-social";
// import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useAuth } from "@/context/AuthContext";
import { signIn } from "@/lib/actions";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  email: string;
  password: string;
};

export default function Page() {
  // const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const initialState = { errorMessage: "" };
  const [state, formAction, pending] = useActionState(signIn, initialState);

  useEffect(() => {
    document.title = "Sign In - CoverSumé";

    // If already authenticated, redirect to dashboard
    // if (isAuthenticated) {
    //   router.push("/dashboard");
    // }
    if (state.errorMessage.length) {
      toast.error(state.errorMessage);
    }
  }, [state.errorMessage, router]);

  // const onSubmit: SubmitHandler<Inputs> = async (data) => {
  //   setError("");
  //   setIsLoading(true);
  //   const { email, password } = data;
  //   try {
  //     await login(email, password);
  //     router.push("/dashboard");
  //   } catch (err) {
  //     setError("Invalid email or password. Please try again.");
  //     console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        // onSubmit={handleSubmit(onSubmit)}
        action={formAction}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home">
              {/* <LogoIcon /> */}
              <FileText />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Sign In to CoverSumé
            </h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <SignInSocial provider="google">
              <Button type="button" variant="outline" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                <span>Google</span>
              </Button>
            </SignInSocial>
            <SignInSocial provider="linkedin">
              <Button type="button" variant="outline" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  // class="bi bi-linkedin"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                </svg>
                <span>LinkedIn</span>
              </Button>
            </SignInSocial>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input type="email" id="email" {...register("email")} />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-title text-sm">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="/forgot-account"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Account ?
                  </Link>
                </Button>
              </div>
              <Input
                type="password"
                // required
                id="pwd"
                className="input sz-md variant-mixed"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>

            <Button className="w-full" disabled={pending}>
              {pending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius)  p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don&apos;t have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/register">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
