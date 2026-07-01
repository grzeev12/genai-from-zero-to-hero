"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
const HEARTBEAT_THROTTLE_MS = 60 * 1000;

export default function IdleLogout() {
  const { data: session } = useSession();
  const lastHeartbeatRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    function resetIdleTimer() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, IDLE_TIMEOUT_MS);
    }

    function onActivity() {
      resetIdleTimer();
      const now = Date.now();
      if (now - lastHeartbeatRef.current > HEARTBEAT_THROTTLE_MS) {
        lastHeartbeatRef.current = now;
        // Re-fetching the session lets NextAuth's updateAge logic silently
        // reissue a fresh session cookie, keeping an active learner signed in.
        fetch("/api/auth/session");
      }
    }

    resetIdleTimer();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, onActivity));
    };
  }, [session?.user]);

  return null;
}
