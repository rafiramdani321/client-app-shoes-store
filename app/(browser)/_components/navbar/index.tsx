import React from "react";
import Logo from "./Logo";
import Search from "./Search";
import Actions from "./actions";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-background h-16 z-50 px-2 lg:px-16 flex justify-between items-center">
      <Logo />
      <div className="flex gap-x-4 items-center">
        <Search />
        <Actions />
      </div>
    </nav>
  );
};

export default Navbar;
