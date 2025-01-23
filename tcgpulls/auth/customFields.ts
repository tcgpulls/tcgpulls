import { Session, User } from "next-auth";
import { AppJWT } from "@/types/Auth";

const customAuthFields = ["id", "username", "access", "active"] as const;

export function updateCustomFieldsInToken(user: User, token: AppJWT) {
  customAuthFields.forEach((field) => {
    (token as Record<string, unknown>)[field] = user[field];
  });
}

export function updateCustomFieldsInSession(token: AppJWT, session: Session) {
  if (!session.user) session.user = {};
  const { user } = session;
  customAuthFields.forEach((field) => {
    (user as Record<string, unknown>)[field] = token[field];
  });
}

export function deleteCustomFieldsInToken(token: AppJWT) {
  customAuthFields.forEach((field) => {
    delete token[field];
  });
}
