"use client";

import Container from "../Container";
import Logo from "./Logo";
// import Logo from "./Logo";
import UserMenu from "./UserMenu";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <div className=" z-10 h-28 w-full bg-green ">
      <div className="py-4 ">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
