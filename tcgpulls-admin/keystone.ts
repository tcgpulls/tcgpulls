// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config
import "dotenv/config";
import { CorsOptions } from "cors";

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import lists from "./schemas/schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";

// we'll also import our access control functions from a separate file
import rules from "./accessControl";

const originRegexes = [
  /^http:\/\/localhost:\d+$/, // local dev
  /^https:\/\/.*tcgpulls\.vercel\.app$/, // ephemeral previews
  /^https:\/\/(www\.)?tcgpulls\.xyz$/, // production domain
];

const originStrings = [process.env.APP_ORIGIN_CORS ?? ""]; // our custom env var

// Our custom function has signature: (origin, callback) => void
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // no origin means server-to-server request; allow it, or block if you prefer
      return callback(null, true);
    }

    // Check if origin matches any of our whitelisted origins
    const isAllowed =
      originRegexes.some((rx) => rx.test(origin)) ||
      originStrings.includes(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};

export default withAuth(
  config({
    server: {
      port: 4000,
      cors: corsOptions,
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
