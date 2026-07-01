import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_PREFIXES = ["/admin", "/api/users", "/api/threshold"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = ADMIN_PREFIXES.some((p) => req.nextUrl.pathname.startsWith(p));

  if (!isLoggedIn) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && req.auth?.user?.role !== "admin") {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: [
    "/",
    "/track/:path*",
    "/admin/:path*",
    "/api/submit",
    "/api/users/:path*",
    "/api/threshold",
  ],
};
