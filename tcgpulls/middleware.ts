import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/auth";

const i18nMiddleware = createMiddleware(routing);

export default auth(async (req) => {
  return i18nMiddleware(req);
});

export const config = {
  matcher: [
    // Exclude API routes and static assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // Include specific paths if necessary
    "/",
    "/(en|ja)/:path*",
  ],
};
