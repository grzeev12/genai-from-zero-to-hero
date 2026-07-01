import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ensureBootstrapAdmin, getUserByEmail, verifyPassword } from "@/lib/db";

const IDLE_TIMEOUT_SECONDS = 15 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: IDLE_TIMEOUT_SECONDS, updateAge: 60 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        await ensureBootstrapAdmin();

        const user = await getUserByEmail(email.trim().toLowerCase());
        if (!user) return null;

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "employee";
      }
      return session;
    },
  },
});
