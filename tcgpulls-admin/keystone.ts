// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config
import "dotenv/config";

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import lists from "./schemas/schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";

// we'll also import our access control functions from a separate file
import rules from "./accessControl";

export default withAuth(
  config({
    server: {
      port: 4000,
      cors: { origin: [`${process.env.APP_CORS_ORIGIN}`], credentials: true },
    },
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL ?? "",
    },
    graphql: {
      debug: true,
    },
    ui: {
      isAccessAllowed: rules.isEditor,
    },
    lists,
    session,
  }),
);
