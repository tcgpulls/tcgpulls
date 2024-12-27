import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const providers = [Google];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
  },
});
