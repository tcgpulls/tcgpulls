import { Session } from "next-auth";

export interface UserAuthenticatedSession extends Session {
  user: {
    id: string;
    access: string;
    name: string;
    username: string;
    email: string;
    image: string;
  };
}

export enum UserAccess {
  Freemium = "freemium",
  Premium = "premium",
}
