import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import type { Session } from "next-auth";
import type { NextRequest } from "next/server";

async function generateUniqueUsername(email: string) {
  const localPart = email.split("@")[0] || "user";
  const normalized = localPart.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const base = normalized || "user";

  let username = base;
  let i = 1;

  while (await db.user.findUnique({ where: { username } })) {
    username = `${base}${i++}`;
  }

  return username;
}

const mockAuthEnabled = process.env.AUTH_MOCK_USER === "true";

const mockUserData = {
  id: "mock-google-user",
  email: "mock.google@basimeme.local",
  name: "Mock Google User",
  image: "https://lh3.googleusercontent.com/a/default-user",
  role: "USER",
  username: "mockgoogle",
  banned: false,
};

async function getMockSession(): Promise<Session> {
  return {
    user: {
      id: mockUserData.id,
      email: mockUserData.email,
      name: mockUserData.name,
      image: mockUserData.image,
      role: mockUserData.role,
      username: mockUserData.username,
      banned: mockUserData.banned,
    },
    expires: "2999-12-31T23:59:59.999Z",
  };
}

const nextAuthConfig = NextAuth({
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
      async profile(profile) {
        const email = profile.email;
        if (!email) {
          throw new Error("Google account without email is not supported");
        }

        const existing = await db.user.findUnique({ where: { email } });

        return {
          id: profile.sub,
          name: profile.name,
          email,
          image: profile.picture,
          username: existing?.username ?? await generateUniqueUsername(email),
          role: existing?.role ?? "USER",
          banned: existing?.banned ?? false,
        };
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
        const existing = await db.user.findUnique({ where: { email: user.email! } });
        if (!existing?.username) {
          const username = await generateUniqueUsername(user.email!);
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
        const username = await generateUniqueUsername(user.email!);
        await db.user.update({ where: { id: user.id }, data: { username } });
      }
    },
  },
});

const { handlers, auth: baseAuth, signIn, signOut } = nextAuthConfig;

type MockRequest = NextRequest & {
  auth?: Session | null;
};

function auth(): Promise<Session | null>;
function auth(
  middleware: (req: MockRequest) => Response | Promise<Response> | void | Promise<void>,
): (req: NextRequest) => Promise<Response | undefined>;
function auth(
  middleware?: (req: MockRequest) => Response | Promise<Response> | void | Promise<void>,
) {
  if (mockAuthEnabled) {
    if (middleware) {
      return async (req: NextRequest) => {
        const requestWithAuth = req as MockRequest;
        requestWithAuth.auth = await getMockSession();
        const response = await middleware(requestWithAuth);
        return response ?? undefined;
      };
    }

    return getMockSession();
  }

  if (middleware) {
    return baseAuth(middleware as Parameters<typeof baseAuth>[0]);
  }

  return baseAuth();
}

export { handlers, auth, signIn, signOut };
export { mockAuthEnabled };

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
