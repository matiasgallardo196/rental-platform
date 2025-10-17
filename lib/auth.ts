import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const secret =
  process.env.NEXTAUTH_SECRET ||
  "development-secret-please-change-in-production";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!process.env.NEXTAUTH_SECRET) {
  console.warn(
    "[v0] NEXTAUTH_SECRET is not set. Using fallback secret for development."
  );
}

export const authOptions: NextAuthOptions = {
  secret,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!res.ok) {
            return null;
          }
          const data = await res.json();
          const user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: null,
            role: data.user.role,
          };
          return user as any;
        } catch (e) {
          console.error("[auth] login error", e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        (token as any).role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
