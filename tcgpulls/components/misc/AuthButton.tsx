"use client";

import { Button } from "@/components/catalyst-ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton = () => {
  const { data: session, status } = useSession();
  console.log("session", session, "status", status);

  if (status === "loading") {
    return <Button disabled>Loading...</Button>;
  }

  return session?.user ? (
    <Button onClick={() => signOut()}>Sign Out</Button>
  ) : (
    <Button onClick={() => signIn("google")}>Sign In</Button>
  );
};

export default AuthButton;
