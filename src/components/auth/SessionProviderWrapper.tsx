"use client";

import { SessionProvider } from "next-auth/react";
import IdleLogout from "@/components/auth/IdleLogout";

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <IdleLogout />
      {children}
    </SessionProvider>
  );
}
