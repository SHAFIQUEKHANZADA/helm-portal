import { NextRequest, NextResponse } from "next/server";
import { computeSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminUser = process.env.ADMIN_USER ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value ?? "";
  let isAuthenticated = false;

  if (adminUser && adminPassword && sessionCookie) {
    const expectedToken = await computeSessionToken(adminUser, adminPassword);
    isAuthenticated = sessionCookie === expectedToken;
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
