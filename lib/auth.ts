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
          image: user.image,
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
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      await connectDB();

      let dbUser = await User.findOne({ email: user.email.toLowerCase() });

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name || user.email.split("@")[0],
          email: user.email.toLowerCase(),
          role: "pending",
          emailVerified: new Date(),
          image: user.image ?? undefined,
        });
      }

      user.id = dbUser._id.toString();
      user.name = dbUser.name;
      user.image = dbUser.image ?? null;
      (user as { role?: string }).role = dbUser.role;

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.name = user.name;
        token.picture = user.image;
      }

      // Fired when the client calls useSession().update({...}) — used
      // after picking a role on /complete-profile, and now also after
      // editing name/photo on the profile page — so the JWT reflects
      // changes without requiring a full re-login.
      if (trigger === "update" && session) {
        if (session.role) token.role = session.role as string;
        if (typeof session.name === "string") token.name = session.name;
        if (typeof session.image === "string" || session.image === null) {
          token.picture = session.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = (token.name as string) ?? session.user.name;
        session.user.image = (token.picture as string) ?? null;
      }
      return session;
    },
  },
});
