// /app/(or wherever)/auth.ts
import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import adminClient from "@/lib/clients/apolloAdminClient";
import {
  GET_USER_BY_EMAIL,
  CREATE_USER,
  UPDATE_USER,
  UPDATE_USER_LASTLOGIN,
  GET_USER_BY_ID,
} from "@/graphql/auth/user/queries";
import {
  GET_ACCOUNT_BY_PROVIDER,
  CREATE_ACCOUNT,
  UPDATE_ACCOUNT,
} from "@/graphql/auth/account/queries";
import {
  deleteCustomFieldsInToken,
  updateCustomFieldsInSession,
  updateCustomFieldsInToken,
} from "@/auth/customFields";
import { AppJWT } from "@/types/Auth";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    /**
     * signIn callback is called whenever a user signs in (OAuth, credentials, etc.)
     * We use it to synchronize with our Keystone DB.
     */
    async signIn({ user, account }) {
      if (!account) {
        console.error("No account in signIn callback; cannot proceed.");
        return false;
      }

      try {
        // 1. If the user does not exist, create them
        const normalizedEmail = user.email?.trim().toLowerCase();

        const { data: existingUser } = await adminClient.query({
          query: GET_USER_BY_EMAIL,
          variables: { email: normalizedEmail },
          fetchPolicy: "network-only",
        });

        let keystoneUserId = existingUser?.user?.id;

        if (!keystoneUserId) {
          // Create a new user
          const createUserResult = await adminClient.mutate({
            mutation: CREATE_USER,
            variables: {
              data: {
                email: normalizedEmail,
                name: user.name,
                image: user.image,
                emailVerified: new Date().toISOString(),
              },
            },
          });
          keystoneUserId = createUserResult?.data?.createUser?.id;
        } else {
          // Update user if it exists
          await adminClient.mutate({
            mutation: UPDATE_USER,
            variables: {
              id: keystoneUserId,
              data: {
                name: user.name,
                image: user.image,
              },
            },
          });
        }

        // 2. Check if an account record exists for this (provider + providerAccountId)
        const { data: accountData } = await adminClient.query({
          query: GET_ACCOUNT_BY_PROVIDER,
          variables: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
          fetchPolicy: "network-only",
        });

        const existingAccount = accountData?.accounts?.[0];

        if (!existingAccount) {
          // Create a new Account in Keystone
          await adminClient.mutate({
            mutation: CREATE_ACCOUNT,
            variables: {
              data: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                idToken: account.id_token,
                tokenType: account.token_type,
                scope: account.scope,
                expiresAt: account.expires_at,
                // Connect the user relationship
                user: {
                  connect: { id: keystoneUserId },
                },
              },
            },
          });
        } else {
          // Optional: you could update the existing account if you want to refresh access/refresh tokens
          // for example, something like:

          await adminClient.mutate({
            mutation: UPDATE_ACCOUNT,
            variables: {
              id: existingAccount.id,
              data: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
              },
            },
          });
        }

        // 3. Update lastLoginAt
        await adminClient.mutate({
          mutation: UPDATE_USER_LASTLOGIN,
          variables: {
            id: keystoneUserId,
            data: {
              lastLoginAt: new Date().toISOString(),
            },
          },
        });

        // 4. Attach keystone fields to the user object
        user.id = keystoneUserId;
        user.access = existingUser?.user?.access;
        user.username = existingUser?.user?.username;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        // If any error occurs, you can choose to deny login by returning false
        return false;
      }

      // If everything is ok, return true
      return true;
    },

    /**
     * jwt callback is invoked whenever a token is created/updated.
     * We store the user.id in the token so it can be made available to the session.
     */
    async jwt({ token, user }) {
      // This runs on *every* JWT update, but `user` is only defined on the *first* call
      // (i.e., immediately after user logs in).
      if (user?.id) {
        // Attach keystone fields attached to the user to the token object
        updateCustomFieldsInToken(user, token as AppJWT);
      }

      // Optional: If you want to ensure the user still exists each time:
      if (token?.id) {
        try {
          const { data } = await adminClient.query({
            query: GET_USER_BY_ID,
            variables: { id: token.id },
            fetchPolicy: "network-only",
          });
          if (!data?.user) {
            // If user was deleted, remove the ID from the token
            deleteCustomFieldsInToken(token as AppJWT);
          }
        } catch (error) {
          deleteCustomFieldsInToken(token as AppJWT);
        }
      }

      return token;
    },

    /**
     * session callback is invoked whenever a session is checked (e.g. useSession in client).
     * We attach token.id as session.user.id
     */
    async session({ session, token }) {
      // If there's no token.id, user doesn't exist or was deleted => no session user
      if (!token?.id) {
        return { ...session, user: undefined };
      }

      // Otherwise, we have a valid user ID => set on session
      if (!session.user) {
        session.user = {} as typeof session.user; // or type assertion
      }

      // Attach keystone fields attached to the user then to the token object
      // to the session
      updateCustomFieldsInSession(token as AppJWT, session);
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
