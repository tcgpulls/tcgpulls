import { list } from "@keystone-6/core";
import {
  text,
  password,
  timestamp,
  relationship,
} from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";
import rules from "../accessControl";
import { CmsUserRoles } from "../types/CmsUser";

const cmsLists: Lists = {
  CmsUser: list({
    access: {
      operation: {
        query: () => true,
        update: () => true,
        create: ({ session }) =>
          rules.isAdmin({ session }) || rules.isSuperAdmin({ session }),
        delete: rules.isSuperAdmin,
      },
      filter: {
        query: ({ session }) => {
          if (!session) return false;
          if (rules.isSuperAdmin({ session })) return true;
          return { id: { equals: session.itemId } };
        },
        update: ({ session }) => {
          if (!session) return false;
          if (rules.isSuperAdmin({ session }) || rules.isAdmin({ session }))
            return true;
          return { id: { equals: session.itemId } };
        },
      },
    },
    ui: {
      isHidden: ({ session }) =>
        !rules.isAdmin({ session }) && !rules.isSuperAdmin({ session }),
      listView: {
        initialColumns: ["name", "email", "role", "createdAt"],
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      password: password({ validation: { isRequired: true } }),
      role: relationship({
        ref: "CmsRole",
        ui: {
          displayMode: "select",
          labelField: "label",
          hideCreate: true,
        },
        access: {
          // For safety, you can ensure that only super-admins can assign super-admin/admin roles:
          update: ({ session }) => {
            if (rules.isSuperAdmin({ session })) return true;
            // If admin, allow assigning role only if the new role is 'editor' or 'viewer'
            // but you won't actually see the super-admin/admin roles anyway,
            // because of the filter in the Role list itself.
            return rules.isAdmin({ session });
          },
        },
      }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),
  CmsRole: list({
    fields: {
      label: text({ validation: { isRequired: true } }),
      value: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    },
    access: {
      operation: {
        query: ({ session }) =>
          rules.isAdmin({ session }) || rules.isSuperAdmin({ session }),
        create: rules.isSuperAdmin,
        update: rules.isSuperAdmin,
        delete: rules.isSuperAdmin,
      },
      filter: {
        query: ({ session }) => {
          if (!session) {
            return false;
          }
          if (rules.isSuperAdmin({ session })) {
            return true;
          }
          if (rules.isAdmin({ session })) {
            return {
              value: { in: [CmsUserRoles.Editor, CmsUserRoles.Viewer] },
            };
          }
          return false;
        },
      },
    },
    ui: {
      isHidden: ({ session }) => !rules.isSuperAdmin({ session }),
    },
  }),
};

export default cmsLists;
