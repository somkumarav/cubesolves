import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { logInSchema } from "@/schemas/auth";
import { db } from "@/lib/prisma";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = await logInSchema.safeParseAsync(credentials);

        if (validatedFields.success) {
          const validatedData = validatedFields.data;
          const user = await db.user.findUnique({
            where: { email: validatedData.email },
          });

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(
            validatedData.password,
            user.password
          );
          if (passwordMatch) return user;
        }
        return null;
      },
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
