// Welcome to some authentication for Keystone
//
// This is using @keystone-6/auth to add the following
// - A sign-in page for your Admin UI
// - A cookie-based stateless session strategy
//    - Using a User email as the identifier
//    - 30 day cookie expiration
//
// This file does not configure what Users can do, and the default for this starter
// project is to allow anyone - logged-in or not - to do anything.
//
// If you want to prevent random people on the internet from accessing your data,
// you can find out how by reading https://keystonejs.com/docs/guides/auth-and-access-control
//
// If you want to learn more about how our out-of-the-box authentication works, please
// read https://keystonejs.com/docs/apis/auth#authentication-api
import { createAuth } from "@keystone-6/auth";

// see https://keystonejs.com/docs/apis/session for the session docs
import { statelessSessions } from "@keystone-6/core/session";
import { SessionStrategy } from "@keystone-6/core/types";
import { jwtVerify } from "jose";
import serverLog from "./utils/serverLog";
import { CmsUserRoles } from "./types/CmsUser";

// withAuth is a function we can use to wrap our base configuration
const { withAuth } = createAuth({
  listKey: "CmsUser",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "id name email role { value } createdAt",
  secretField: "password",
});

// statelessSessions uses cookies for session tracking
//   these cookies have an expiry, in seconds
//   we use an expiry of 30 days for this starter
const sessionMaxAge = 60 * 60 * 24 * 30;

// A shape that matches what Keystone's admin UI session might return
type MySession = {
  listKey?: string;
  itemId?: string;
  data?: any; // or something more specific
};

const baseSession = statelessSessions<MySession>({
  maxAge: sessionMaxAge,
  secret: process.env.COOKIE_SECRET,
});

const session: SessionStrategy<MySession> = {
  async get({ context }) {
    const authHeader = context.req?.headers.authorization || "";

    // 1) Check if it's the sudo token
    if (authHeader === `Bearer ${process.env.KEYSTONE_ADMIN_TOKEN}`) {
      return {
        listKey: "CmsUser",
        itemId: "__SUDO__",
        data: { role: { value: CmsUserRoles.SuperAdmin } },
      };
    }

    // 2) Otherwise, check if it's a user-level JWT
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
        const { payload } = await jwtVerify(token, secret);

        // Return a “User” session
        return {
          itemId: (payload as any).id,
          listKey: "User",
          data: payload,
        };
      } catch (err) {
        serverLog("JWT verification failed:", err);
        return undefined;
      }
    }

    // 3) Otherwise, fallback to checking the Keystone Admin UI cookie
    const adminSession = await baseSession.get({ context });
    if (adminSession?.itemId) {
      return { ...adminSession, listKey: "CmsUser" };
    }

    // 4) No session
    return undefined;
  },

  async start({ context, data }) {
    return baseSession.start({ context, data });
  },

  async end({ context }) {
    return baseSession.end({ context });
  },
};

export { withAuth, session };
