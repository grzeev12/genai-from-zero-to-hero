import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "employee";
      track: "managers" | "devops" | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: "admin" | "employee";
    track: "managers" | "devops" | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "employee";
    track: "managers" | "devops" | null;
  }
}
