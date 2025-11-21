import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          // Mock user for MVP
          if (
            parsedCredentials.data.email === "admin@nexus.com" &&
            parsedCredentials.data.password === "password"
          ) {
            return {
              id: "1",
              name: "Admin User",
              email: "admin@nexus.com",
              role: "ADMIN",
            };
          }
        }
        return null;
      },
    }),
  ],
});
