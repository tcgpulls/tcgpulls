import { Session } from "next-auth";

export interface UserAuthenticatedSession extends Session {
  user: {
    id?: string | undefined;
    access?: string | undefined;
    name?: string | null | undefined;
    username?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    active?: boolean | undefined;
  };
}

export enum UserAccess {
  Freemium = "freemium",
  Premium = "premium",
}
