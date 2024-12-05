import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

type Props = {};

const AccountBar = ({}: Props) => {
  return (
    <div className={`flex items-center`}>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default AccountBar;
