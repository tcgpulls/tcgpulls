import AccountBar from "@/components/navigation/AccountBar";
import { Navbar } from "@/components/catalyst-ui/navbar";

const NavbarContent = () => {
  return (
    <Navbar>
      <div className={`w-full flex items-center`}>
        <div className={`flex-1 flex justify-center`}>
          <p className={`font-bold`}>{process.env.NEXT_PUBLIC_APP_NAME}</p>
        </div>
        <AccountBar />
      </div>
    </Navbar>
  );
};

export default NavbarContent;
