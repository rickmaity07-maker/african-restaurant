import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  const token = await getToken({
    req,
    secret,
    // This is the important part for production (HTTPS)
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token || (token as { role?: string }).role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};