"use server";

import { signOut as naSignOut } from "@/auth";

const signOut = async () => {
  await naSignOut();
};

export default signOut;
