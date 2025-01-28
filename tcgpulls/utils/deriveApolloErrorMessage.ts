import { ApolloError } from "@apollo/client";
import { getTranslations } from "next-intl/server";

interface PrismaErrorExtensions {
  prisma: {
    code: string;
    clientVersion?: string;
    meta?: {
      target?: string[];
      cause?: string;
    };
  };
}

function isPrismaExtensions(obj: unknown): obj is PrismaErrorExtensions {
  return (
    typeof obj === "object" && obj !== null && "prisma" in obj // basic check; you can refine more if needed
  );
}

function getPrismaError(error: ApolloError) {
  const gErr = error.graphQLErrors?.[0];
  if (!gErr) return undefined;

  const ex = gErr.extensions;
  if (isPrismaExtensions(ex)) {
    return ex.prisma;
  }
  return undefined;
}

export async function deriveApolloErrorMessage(
  error: ApolloError,
): Promise<string> {
  const t = await getTranslations();
  // 1) Check if it’s a Prisma error
  const prismaError = getPrismaError(error);
  if (prismaError?.code === "P2002") {
    if (prismaError.meta?.target?.includes("username")) {
      return t("common.errors.username-taken");
    }
    return t("common.errors.generic");
  }

  // 2) Check if it’s a Keystone “Access Denied” error
  if (error.message.includes("Access denied")) {
    return t("common.errors.access-denied-action");
  }

  // 4) Generic fallback
  return error.message || t("common.errors.generic");
}
