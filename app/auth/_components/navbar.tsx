import Logo from "@/app/(browser)/_components/navbar/Logo";
import Search from "@/app/(browser)/_components/navbar/Search";
import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-background h-16 z-50 px-4 lg:px-16 flex justify-between items-center">
      <Logo />
      <div>
        <Search />
      </div>
    </nav>
  );
};

export default Navbar;
