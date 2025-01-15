import { getContext } from "@keystone-6/core/context";
import config from "./keystone"; // Adjust the path to your Keystone configuration
import * as PrismaModule from "@prisma/client";

async function seedData() {
  // 1. Create a context
  const context = getContext(config, PrismaModule);

  // 2. Use the context to create items in your lists.
  console.log("Seeding roles...");
  const roles = await context.sudo().db.CmsRole.createMany({
    data: [
      { label: "Super Admin", value: "super-admin" },
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
  });
  console.log("Roles seeded:", roles);

  console.log("Seeding default super admin user...");
  const superAdminUser = await context.sudo().db.CmsUser.createOne({
    data: {
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD, // hashed automatically
      role: { connect: { value: "super-admin" } },
    },
  });
  console.log("Super admin user seeded:", superAdminUser);

  console.log("Seeding complete!");
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
