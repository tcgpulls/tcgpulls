import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../catalyst-ui/dropdown";
import { Avatar } from "../catalyst-ui/avatar";
import { SidebarItem } from "../catalyst-ui/sidebar";
import { User } from "next-auth";
import { signOut } from "@/auth";

async function onSignOut() {
  "use server";
  await signOut();
}

function AccountDropdownMenu({
  anchor,
}: {
  anchor: "top start" | "bottom end";
}) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href={`/app/profile`}>
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem type="submit" onClick={onSignOut}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

type Props = {
  user?: User;
};

const AccountBar = ({ user }: Props) => {
  if (!user) {
    // TODO: Sign in via a dialog
    return <div>Sign in ...</div>;
  }

  return (
    <Dropdown>
      <DropdownButton as={SidebarItem}>
        <span className="flex min-w-0 items-center gap-3">
          <Avatar src={user.image} className="size-10" square alt="" />
          <span className="min-w-0">
            <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
              {user.name}
            </span>
            <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
          </span>
        </span>
        <ChevronUpIcon />
      </DropdownButton>
      <AccountDropdownMenu anchor="top start" />
    </Dropdown>
  );
};

export default AccountBar;
