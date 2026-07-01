import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_PREFIXES = ["/admin", "/api/users", "/api/module-threshold"];

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

  // Employees assigned to a track are fully blocked from the other track.
  const role = req.auth?.user?.role;
  const userTrack = req.auth?.user?.track;
  if (role !== "admin" && userTrack) {
    const otherTrack = userTrack === "managers" ? "devops" : "managers";
    if (req.nextUrl.pathname.startsWith(`/track/${otherTrack}`)) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }
});

export const config = {
  matcher: [
    "/",
    "/track/:path*",
    "/admin/:path*",
    "/api/submit",
    "/api/users/:path*",
    "/api/module-threshold",
  ],
};
