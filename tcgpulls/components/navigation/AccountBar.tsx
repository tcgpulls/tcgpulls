import { signIn } from "@/auth";

type Props = {};

const AccountBar = ({}: Props) => {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>
    </div>
  );
};

export default AccountBar;
