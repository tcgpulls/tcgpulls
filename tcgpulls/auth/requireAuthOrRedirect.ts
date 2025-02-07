// /lib/requireAuth.ts
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserAccess, UserAuthenticatedSession } from "@/types/Users";

interface RequireAuthOptions {
  redirectRoute: string;
  requiredAccess?: UserAccess;
}

export async function requireAuthOrRedirect(
  options: RequireAuthOptions,
): Promise<UserAuthenticatedSession> {
  const { redirectRoute, requiredAccess } = options;

  const session = await auth();

  // If not authenticated => redirect them to sign-in with google
  if (!session?.user?.id) {
    const signInUrl = `/api/auth/signin?callbackUrl=${encodeURIComponent(
      redirectRoute,
    )}`;
    redirect(signInUrl);
  }

  // If user is authenticated but lacks required access => redirectRoute
  if (requiredAccess && session.user.access !== requiredAccess) {
    redirect(redirectRoute);
  }

  return session as UserAuthenticatedSession;
}
