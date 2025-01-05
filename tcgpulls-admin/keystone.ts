// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";

// forcing load of `.env.local` at the root of the project:
import "dotenv/config";
import path from "path";

require("dotenv").config({
  path: path.join(__dirname, "..", "..", ".env.local"),
});

export default withAuth(
  config({
    server: {
      port: 4000,
    },
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL || "",
      prismaSchemaPath: "../packages/prisma/schema.prisma",
      prismaClientPath: "../packages/prisma/node_modules/.prisma/client",
    },
    lists,
    session,
  }),
);
