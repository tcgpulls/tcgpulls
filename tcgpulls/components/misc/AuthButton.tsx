"use client";

import { Button } from "@/components/catalyst-ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton = () => {
  const { data: session, status } = useSession();

  console.log(session);

  if (status === "loading") {
    return <Button disabled>Loading...</Button>;
  }

  return status === "authenticated" ? (
    <Button onClick={() => signOut()}>Sign Out</Button>
  ) : (
    <Button onClick={() => signIn("google")}>Sign In</Button>
  );
};

export default AuthButton;
