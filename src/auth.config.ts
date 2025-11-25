import type { DefaultSession, NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";

type ExtendedToken = JWT & {
  isSuperAdmin?: boolean;
};

type ExtendedSessionUser = DefaultSession["user"] & {
  id?: string;
  isSuperAdmin?: boolean;
};

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      const extendedToken = token as ExtendedToken;

      if (user && "isSuperAdmin" in user) {
        const maybeFlag = (user as { isSuperAdmin?: boolean | null }).isSuperAdmin;
        extendedToken.isSuperAdmin = maybeFlag ?? false;
      }

      return extendedToken;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as ExtendedSessionUser;
        user.id = token.sub;
        user.isSuperAdmin = (token as ExtendedToken).isSuperAdmin ?? false;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isLoginPage = pathname.startsWith("/login");
      const isPublicSite = pathname.startsWith("/site");

      // Login page: allow if logged out, redirect home if already logged in
      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Public marketing site is always accessible
      if (isPublicSite) {
        return true;
      }

      // Everything else is part of the authenticated app surface
      if (!isLoggedIn) {
        // Let next-auth redirect unauthenticated users to the sign-in page
        return false;
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
