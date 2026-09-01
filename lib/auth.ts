import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() }).select(
          "+passwordHash"
        );

        // No account, or an OAuth-only account with no local password set
        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Credentials sign-ins already resolved to a real DB user in
      // authorize() above — nothing more to do here.
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      await connectDB();

      let dbUser = await User.findOne({ email: user.email.toLowerCase() });

      if (!dbUser) {
        // First time signing in with this Google account — create a User
        // with role "pending". Google has already verified this email
        // address, so we can mark it verified immediately and skip our
        // own activation-email flow for this account.
        dbUser = await User.create({
          name: user.name || user.email.split("@")[0],
          email: user.email.toLowerCase(),
          role: "pending",
          emailVerified: new Date(),
          image: user.image ?? undefined,
        });
      }

      // Attach the real Mongo id/role onto the object NextAuth passes
      // forward, so the jwt() callback below can read them.
      user.id = dbUser._id.toString();
      (user as { role?: string }).role = dbUser.role;

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }

      // Fired when the client calls useSession().update({ role: ... }) —
      // used right after someone picks their role on /complete-profile,
      // so the JWT reflects it without requiring a full re-login.
      if (trigger === "update" && session?.role) {
        token.role = session.role as string;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
