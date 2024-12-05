import AccountBar from "@/components/navigation/AccountBar";
import { Navbar } from "@/components/catalyst-ui/navbar";

type Props = {};

const NavbarContent = ({}: Props) => {
  return (
    <Navbar>
      <div className={`w-full flex items-center`}>
        <div className={`flex-1 flex justify-center`}>
          <p className={`font-bold`}>TCGPulls</p>
        </div>
        <AccountBar />
      </div>
    </Navbar>
  );
};

export default NavbarContent;
