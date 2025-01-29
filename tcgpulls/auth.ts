// /app/(or wherever)/auth.ts
import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import adminClient from "@/lib/clients/apolloAdminClient";
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
  UPDATE_USER,
  UPDATE_USER_LASTLOGIN,
} from "@/graphql/user/queries";
import {
  CREATE_ACCOUNT,
  GET_ACCOUNT_BY_PROVIDER,
  UPDATE_ACCOUNT,
} from "@/graphql/account/queries";
import { SignJWT } from "jose";

// we need to set this to avoid lingering cache issues when handling auth
const FETCH_POLICY = "network-only";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
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
          fetchPolicy: FETCH_POLICY,
        });

        let userRecord = existingUser?.user;

        if (!userRecord?.id) {
          // Create new user
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
            fetchPolicy: FETCH_POLICY,
          });
          userRecord = createUserResult?.data?.createUser;
        } else {
          // Update existing user
          await adminClient.mutate({
            mutation: UPDATE_USER,
            variables: {
              id: userRecord.id,
              data: {
                name: user.name,
                image: user.image,
              },
            },
            fetchPolicy: FETCH_POLICY,
          });
        }

        // Now we definitely have userRecord with an .id
        await adminClient.mutate({
          mutation: UPDATE_USER_LASTLOGIN,
          variables: {
            id: userRecord.id,
            data: {
              lastLoginAt: new Date().toISOString(),
            },
          },
          fetchPolicy: FETCH_POLICY,
        });

        // 3. Update lastLoginAt
        await adminClient.mutate({
          mutation: UPDATE_USER_LASTLOGIN,
          variables: {
            id: userRecord.id,
            data: {
              lastLoginAt: new Date().toISOString(),
            },
          },
          fetchPolicy: FETCH_POLICY,
        });

        // Finally, set the fields on the NextAuth `user` object
        user.id = userRecord.id;

        // 2. Check if an account record exists for this (provider + providerAccountId)
        const { data: accountData } = await adminClient.query({
          query: GET_ACCOUNT_BY_PROVIDER,
          variables: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
          fetchPolicy: FETCH_POLICY,
        });

        const accountRecord = accountData?.accounts?.[0];

        if (!accountRecord) {
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
                  connect: { id: userRecord.id },
                },
              },
            },
            fetchPolicy: FETCH_POLICY,
          });
        } else {
          // Optional: you could update the existing account if you want to refresh access/refresh tokens
          // for example, something like:

          await adminClient.mutate({
            mutation: UPDATE_ACCOUNT,
            variables: {
              id: accountRecord.id,
              data: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
              },
            },
            fetchPolicy: FETCH_POLICY,
          });
        }
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
        token.id = user.id;
      }

      // Optional: If you want to ensure the user still exists each time:
      if (token?.id) {
        try {
          const { data } = await adminClient.query({
            query: GET_USER_BY_ID,
            variables: { id: token.id },
            fetchPolicy: FETCH_POLICY,
          });

          if (!data?.user) {
            // If user was deleted, remove the ID from the token
            delete token.id;
          }
        } catch (error) {
          delete token.id;
        }
      }

      // 3. Sign a minimal payload – *not* the entire token object
      //    i.e. only { id: token.id } or { sub: token.id } or however you'd like
      const minimalPayload = {
        id: token.id,
      };

      // 4. Use JOSE to sign that minimal payload
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      (token as any).rawJwt = await new SignJWT(minimalPayload)
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

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

      // Put the raw JWT on session.user.token
      if (!session.user) session.user = {} as any;
      (session.user as any).id = token.id;
      (session.user as any).token = (token as any).rawJwt ?? null;

      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
