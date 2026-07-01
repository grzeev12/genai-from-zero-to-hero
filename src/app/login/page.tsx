"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("אימייל או סיסמה שגויים");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}
      className="rounded-3xl p-8 space-y-4 text-right"
      style={{ background: "var(--surface)", border: "1.5px solid var(--border)", boxShadow: "0 4px 24px rgba(124,92,62,0.07)" }}>

      <input
        type="email"
        dir="ltr"
        placeholder="אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-2xl px-4 py-3 text-right outline-none"
        style={{ background: "var(--cream)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
        required
      />

      <input
        type="password"
        dir="ltr"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-2xl px-4 py-3 text-right outline-none"
        style={{ background: "var(--cream)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
        required
      />

      {error && (
        <p className="text-sm text-right" style={{ color: "#c04a4a" }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-7 py-3 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "var(--mocha)", color: "white" }}>
        {loading ? "מתחבר..." : "התחבר"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16" style={{ background: "var(--cream)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "var(--mocha-dark)" }}>
            GenAI: From Zero to Hero
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            התחברות למערכת
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
