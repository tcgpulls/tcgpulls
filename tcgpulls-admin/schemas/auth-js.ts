import { list } from "@keystone-6/core";
import {
  text,
  timestamp,
  relationship,
  integer,
  checkbox,
  json,
} from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";
import rules from "../accessControl";

const authJsLists: Lists = {
  User: list({
    access: rules.isSuperAdmin,
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
    },
    fields: {
      name: text(),
      email: text({ isIndexed: "unique", validation: { isRequired: true } }),
      emailVerified: timestamp(),
      image: text(),
      createdAt: timestamp({ defaultValue: { kind: "now" } }),
      updatedAt: timestamp({ db: { updatedAt: true } }),
      accounts: relationship({ ref: "Account.user", many: true }),
      authenticators: relationship({ ref: "Authenticator.user", many: true }),
      sessions: relationship({ ref: "Session.user", many: true }),
    },
  }),
  Account: list({
    access: rules.isSuperAdmin,
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
    },
    fields: {
      user: relationship({ ref: "User.accounts" }),
      type: text(),
      provider: text(),
      providerAccountId: text(),
      refreshToken: text(),
      accessToken: text(),
      expiresAt: integer(),
      tokenType: text(),
      scope: text(),
      idToken: text(),
      sessionState: text(),
      createdAt: timestamp({ defaultValue: { kind: "now" } }),
      updatedAt: timestamp({ db: { updatedAt: true } }),
    },
    // Composite key equivalent can be managed via hooks or database-level constraints
  }),
  Session: list({
    access: rules.isSuperAdmin,
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
    },
    fields: {
      sessionToken: text({
        isIndexed: "unique",
        validation: { isRequired: true },
      }),
      user: relationship({ ref: "User.sessions" }),
      expires: timestamp(),
      createdAt: timestamp({ defaultValue: { kind: "now" } }),
      updatedAt: timestamp({ db: { updatedAt: true } }),
    },
  }),
  VerificationToken: list({
    access: rules.isSuperAdmin,
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
    },
    fields: {
      identifier: text(),
      token: text(),
      expires: timestamp(),
    },
    // Composite key equivalent can be managed via hooks or database-level constraints
  }),
  Authenticator: list({
    access: rules.isSuperAdmin,
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
    },
    fields: {
      credentialID: text({
        isIndexed: "unique",
        validation: { isRequired: true },
      }),
      user: relationship({ ref: "User.authenticators" }),
      providerAccountId: text(),
      credentialPublicKey: text(),
      counter: integer(),
      credentialDeviceType: text(),
      credentialBackedUp: checkbox(),
      transports: json(),
    },
    // Composite key equivalent can be managed via hooks or database-level constraints
  }),
};

export default authJsLists;
