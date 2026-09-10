import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  
  // Debug: log all cookies received
  const allCookies = req.cookies.getAll();
  console.log("Middleware cookies:", allCookies.map(c => c.name));
  console.log("Env:", process.env.NODE_ENV);
  
  // Try without explicit cookieName - let getToken auto-detect
  const token = await getToken({ req, secret });

  console.log("Token found:", !!token);
  if (token) console.log("Token role:", (token as { role?: string }).role);

  if (!token || (token as { role?: string }).role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };