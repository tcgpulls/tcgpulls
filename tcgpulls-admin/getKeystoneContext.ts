// getKeystoneContext.ts
import { getContext } from "@keystone-6/core/context";
import config from "./keystone"; // Adjust the import path to your Keystone configuration
import * as PrismaModule from "@prisma/client";

let contextPromise: Promise<ReturnType<typeof getContext>> | null = null;

export default async function getKeystoneContext({
  sudo,
}: { sudo?: boolean } = {}) {
  if (!contextPromise) {
    contextPromise = (async () => {
      const context = getContext(config, PrismaModule);
      if (config.db.onConnect) {
        await config.db.onConnect(context);
      }
      return sudo ? context.sudo() : context;
    })();
  }
  return contextPromise;
}
