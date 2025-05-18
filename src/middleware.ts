import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/generator", "/profile", "/history"];
const publicRoutes = [
  "/login",
  "/register",
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/faq",
  "/pricing",
  "/blog",
  "/blog/[slug]",
  "/cookie",
];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   console.log(`--- MINIMAL MIDDLEWARE --- Path: ${req.nextUrl.pathname} ---`);
//   return NextResponse.next();
// }

// export const config = {
//   // Match ALL paths for testing, except for Next.js internals
//   matcher: ["/((?!_next|static|favicon.ico|api).*)"],
// };
