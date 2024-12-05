import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

type Props = {};

const Navigation = ({}: Props) => {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Navigation;
