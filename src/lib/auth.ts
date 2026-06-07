import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

type FirebaseSignInResponse = {
  localId?: string;
  email?: string;
  displayName?: string;
  idToken?: string;
  error?: { message?: string };
};

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        if (!apiKey) {
          console.error("[auth] Falta NEXT_PUBLIC_FIREBASE_API_KEY");
          return null;
        }

        try {
          const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                returnSecureToken: true,
              }),
            },
          );
          const data = (await res.json()) as FirebaseSignInResponse;
          if (!res.ok || !data.localId) return null;

          return {
            id: data.localId,
            email: data.email ?? credentials.email,
            name: data.displayName ?? data.email ?? null,
          };
        } catch (error) {
          console.error("[auth] Error validando contra Firebase", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
