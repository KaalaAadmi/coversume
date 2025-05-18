import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

if (!secretKey) {
  throw new Error(
    "SESSION_SECRET environment variable is not set. Please add it to your .env.local file."
  );
}

export interface SessionPayload extends Record<string, unknown> {
  userId: string;
  // Add other session data here, like roles, expiry, etc.
  expires?: Date;
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      payload.expires ? payload.expires.getTime() / 1000 : "30d" // Default to 30 days
    ) // Default to 30 days
    .sign(key);
}

export async function decrypt(
  input: string | undefined
): Promise<SessionPayload | null> {
  if (!input) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ userId, expires });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookie = (await cookies()).get("session")?.value;
  return await decrypt(cookie);
}

export async function updateSession(request: NextRequest) {
  const session = await getSession();
  if (!session) return;

  // Refresh the session so it doesn't expire
  session.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const res = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  res.cookies.set({
    name: "session",
    value: await encrypt(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: session.expires,
    sameSite: "lax",
    path: "/",
  });
  return res;
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
