import { getContext } from "@keystone-6/core/context";
import config from "./keystone"; // Adjust the path to your Keystone configuration
import * as PrismaModule from "@prisma/client";
import serverLog from "./utils/serverLog";
import { CmsUserRoles } from "./types/CmsUser";

async function seedData() {
  // 1. Create a context
  const context = getContext(config, PrismaModule);

  // 2. Use the context to create items in your lists.
  serverLog("Seeding roles...");
  const roles = await context.sudo().db.CmsRole.createMany({
    data: [
      { label: "Super Admin", value: CmsUserRoles.SuperAdmin },
      { label: "Admin", value: CmsUserRoles.Admin },
      { label: "Editor", value: CmsUserRoles.Editor },
      { label: "Viewer", value: CmsUserRoles.Viewer },
    ],
  });
  serverLog("Roles seeded:", roles);

  serverLog("Seeding default super admin user...");
  const superAdminUser = await context.sudo().db.CmsUser.createOne({
    data: {
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD, // hashed automatically
      role: { connect: { value: CmsUserRoles.SuperAdmin } },
    },
  });
  serverLog("Super admin user seeded:", superAdminUser);

  serverLog("Seeding complete!");
}

// Run it
seedData()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
