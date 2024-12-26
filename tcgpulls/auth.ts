import NextAuth from "next-auth";
import Google from "@auth/core/providers/google";
import { Provider } from "@auth/core/providers";

const providers: Provider[] = [Google];

export const providerMap = providers
  .map((provider: Provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
  },
});
