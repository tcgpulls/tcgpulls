"use server";

import { signIn as naSignIn } from "@/auth";

const signIn = async (providerName: string) => {
  await naSignIn(providerName);
};

export default signIn;
