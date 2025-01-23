// /lib/requireAuth.ts
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserAccess, UserAuthenticatedSession } from "@/types/Users";
import getTcgLanguage from "@/actions/getTcgLanguage";
import { Locale } from "@/i18n/routing";

/**
 * Options for requireAuth
 */
interface RequireAuthOptions {
  localeParam?: Locale;
  /**
   * A custom path to redirect if auth fails or roles are not met.
   * Default is "/app".
   */
  fallback?: string;
  /**
   * Access of the user required to access the page.
   */
  requiredAccess?: UserAccess;
}

/**
 * requireAuth checks if the user is authenticated.
 * If "access" is provided, also checks what kind of access the user has.
 * If authentication fails or roles not met, redirects to the fallback path (default "/app").
 */
export async function requireAuth(
  options: RequireAuthOptions = {},
): Promise<UserAuthenticatedSession> {
  const locale = options.localeParam ?? (await getTcgLanguage());
  const { fallback = `/${locale}/app`, requiredAccess } = options;

  const session = await auth();

  if (!session?.user?.id) {
    redirect(fallback);
  }

  if (requiredAccess && session.user.access !== requiredAccess) {
    redirect(fallback);
  }

  return session as UserAuthenticatedSession;
}
