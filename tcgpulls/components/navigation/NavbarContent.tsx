import { Navbar } from "@/components/catalyst-ui/navbar";

const NavbarContent = () => {
  return (
    <Navbar>
      <div className={`w-full flex items-center`}>
        <div className={`flex-1 flex justify-center -ml-10`}>
          <p className={`font-bold`}>{process.env.NEXT_PUBLIC_APP_NAME}</p>
        </div>
      </div>
    </Navbar>
  );
};

export default NavbarContent;
