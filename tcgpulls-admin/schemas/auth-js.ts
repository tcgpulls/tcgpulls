import { graphql, list } from "@keystone-6/core";
import {
  checkbox,
  integer,
  json,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";
import rules from "../accessControl";
import generateUniqueUsername from "../utils/generateUniqueUsername";
import { UserAccess } from "../types/User";

const authJsLists: Lists = {
  User: list({
    access: rules.isSudoOrSuperAdmin,
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
      listView: {
        initialColumns: ["email", "name", "username", "lastLoginAt"],
      },
    },
    fields: {
      name: text(),
      username: text({
        isIndexed: "unique",
        validation: { isRequired: false },
      }),
      email: text({ isIndexed: "unique", validation: { isRequired: true } }),
      emailVerified: timestamp(),
      image: text(),
      lastLoginAt: timestamp(),
      createdAt: timestamp({ defaultValue: { kind: "now" } }),
      updatedAt: timestamp({ db: { updatedAt: true } }),
      access: select({
        type: "enum",
        options: [
          { label: "Freemium", value: UserAccess.Freemium },
          { label: "Premium", value: UserAccess.Premium },
        ],
        defaultValue: UserAccess.Freemium,
      }),
      accounts: relationship({ ref: "Account.user", many: true }),
      authenticators: relationship({ ref: "Authenticator.user", many: true }),
      sessions: relationship({ ref: "Session.user", many: true }),
    },
    hooks: {
      resolveInput: async ({ operation, resolvedData, context }) => {
        // Only run on CREATE
        if (operation === "create") {
          // If the client provided a username, skip
          if (!resolvedData.username) {
            // Generate a unique username
            resolvedData.username = await generateUniqueUsername(context);
          }
        }

        return resolvedData;
      },
    },
  }),
  Account: list({
    access: rules.isSudoOrSuperAdmin,
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
      listView: {
        initialColumns: ["id", "userEmail", "user", "provider"],
      },
    },
    fields: {
      user: relationship({ ref: "User.accounts" }),
      userEmail: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve: async (item, args, context) => {
            // 'item' is the Account item. 'item.userId' holds the related user ID
            if (!item.userId) return null;

            // find the user from the DB
            const user = await context.query.User.findOne({
              where: { id: item.userId.toString() },
              query: "id email",
            });
            return user?.email ?? null;
          },
        }),
        ui: {
          listView: { fieldMode: "read" }, // so it's visible in list UI
        },
      }),
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
    access: rules.isSudoOrSuperAdmin,
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
    access: rules.isSudoOrSuperAdmin,
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
    access: rules.isSudoOrSuperAdmin,
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
