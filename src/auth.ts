import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { CubeType } from "@prisma/client";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: { signIn: "/auth/signin", error: "/auth/error" },
  events: {
    async linkAccount({ user }) {
      await db.$transaction(async (tx) => {
        const session = await tx.solveSession.create({
          data: {
            name: "1",
            cube: CubeType.CUBE_33,
            userId: user.id!,
          },
        });

        await tx.userSetting.create({
          data: {
            latestSolveSessionId: session.id,
            userId: user.id!,
          },
        });

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
          },
          include: {
            userSettings: true,
            solveSessions: true,
          },
        });

        return updatedUser;
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await db.user.findUnique({
        where: { id: user.id },
      });

      // Prevent sign-in if the user has not verified their email
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
