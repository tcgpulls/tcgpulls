import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import authConfig from "./auth.config";
import { routing } from "./i18n/routing";

export const { auth: middleware } = NextAuth(authConfig);

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ja)/:path*"],
};
