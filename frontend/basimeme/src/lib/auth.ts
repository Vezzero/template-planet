import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;
        if (user.banned) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const dbUser = await db.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.banned = dbUser.banned;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.banned = token.banned as boolean;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Auto-create username from email if not exists
        const existing = await db.user.findUnique({ where: { email: user.email! } });
        if (!existing?.username) {
          const base = user.email!.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
          let username = base;
          let i = 1;
          while (await db.user.findUnique({ where: { username } })) {
            username = `${base}${i++}`;
          }
          await db.user.update({
            where: { email: user.email! },
            data: { username },
          });
        }
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      if (!(user as any).username) {
        const base = user.email!.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
        let username = base;
        let i = 1;
        while (await db.user.findUnique({ where: { username } })) {
          username = `${base}${i++}`;
        }
        await db.user.update({ where: { id: user.id }, data: { username } });
      }
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      username: string;
      banned: boolean;
    };
  }
}
