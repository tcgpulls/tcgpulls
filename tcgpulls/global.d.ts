import "next-auth";
import { AdapterUser as DefaultAdapterUser } from "next-auth/adapters";

/**
 * Here we augment the `next-auth` module's `User`, `Session`, `JWT`, plus
 * the `AdapterUser` from `next-auth/adapters`.
 */
declare module "next-auth" {
  // 1) Extend the built-in `User`
  interface User {
    id?: string;
    access?: string;
    username?: string | null;
  }

  // 2) Extend the JWT
  interface JWT {
    id?: string;
  }

  // 3) Extend the Session object
  interface Session {
    user?: {
      id?: string;
      access?: string;
      name?: string | null;
      username?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// 4) Extend the `AdapterUser`
declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultAdapterUser {
    id?: string;
    access?: string;
    username?: string | null;
  }
}
