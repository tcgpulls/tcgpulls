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
    access: {
      // 1. Operation-level access (broad rules)
      operation: {
        // (A) Query: must at least allow some reading. We'll refine with filter.query
        query: () => true,

        // (B) Create: if you want an open sign-up, do `() => true`.
        // If you only want admins or superadmins to create users, do something else:
        create: ({ session, context }) =>
          rules.isSudoOrSuperAdmin({ session }) || rules.isAdmin({ session }),

        // (C) Update: allowed in principle, but we refine with filter.update
        update: () => true,

        // (D) Delete: only superadmins or sudo
        delete: ({ session }) => rules.isSudoOrSuperAdmin({ session }),
      },

      // 2. Fine-grained filter rules
      filter: {
        // (A) Query: superadmin or admin => see all. Otherwise => see only self
        query: ({ session, context }) => {
          if (
            rules.isSudoOrSuperAdmin({ session, context }) ||
            rules.isAdmin({ session })
          ) {
            return true;
          }
          // Otherwise, only see self
          return { id: { equals: session?.itemId } };
        },

        // (B) Update: superadmin => update anyone, admin => update anyone, self => only own record
        update: ({ session, context }) => {
          if (
            rules.isSudoOrSuperAdmin({ session, context }) ||
            rules.isAdmin({ session })
          ) {
            return true;
          }
          // Normal user => can only update themselves
          return { id: { equals: session?.itemId } };
        },

        // (C) Delete: superadmin or sudo => can delete anything,
        // but we've already blocked others entirely in operation.delete.
        // You can either return false or do the same logic as operation.delete
        delete: ({ session, context }) => {
          if (rules.isSudoOrSuperAdmin({ session, context })) {
            return true;
          }
          // If you want to *also* let admin delete, add `|| rules.isAdmin({ session })`.
          return false;
        },
      },
    },
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
      listView: {
        initialColumns: ["email", "name", "username", "access", "lastLoginAt"],
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
      active: checkbox({ defaultValue: true }),
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
