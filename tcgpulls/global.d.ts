import "next-auth";
import { AppJWT } from "@/types/Auth";
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
    active?: boolean;
    token?: string;
  }

  // 2) Extend the JWT
  interface JWT extends AppJWT {}

  // 3) Extend the Session object
  interface Session {
    user?: {
      id?: string;
      access?: string;
      name?: string | null;
      username?: string | null;
      email?: string | null;
      image?: string | null;
      active?: boolean;
      token?: string;
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
