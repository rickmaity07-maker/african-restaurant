import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  // Auth.js v5 uses different cookie names in production vs development
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  const cookieName = process.env.NODE_ENV === "production" ? "__host-session" : "__session";
  
  // Debug: log all cookies received
  const allCookies = req.cookies.getAll();
  console.log("Middleware cookies:", allCookies.map(c => c.name));
  console.log("Looking for cookie:", cookieName);
  console.log("Env:", process.env.NODE_ENV);
  
  const token = await getToken({ req, secret, cookieName });

  console.log("Token found:", !!token);
  if (token) console.log("Token role:", (token as { role?: string }).role);

  if (!token || (token as { role?: string }).role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };