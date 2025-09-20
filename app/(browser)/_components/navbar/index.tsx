"use client";

import React from "react";
import { Menu, Phone, X } from "lucide-react";

import { useSidebar } from "@/stores/useSidebar";
import { Hint } from "@/components/hint";
import Logo from "./Logo";
import Search from "./Search";
import Actions from "./actions";

const Navbar = () => {
  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);

  const toggleSidebar = () => {
    collapsed ? onExpand() : onCollapse();
  };

  const Icon = collapsed ? Menu : X;
  return (
    <nav className="fixed top-0 w-full bg-background h-[62px] md:h-16 z-[100] flex justify-between items-center px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64">
      <div className="hidden lg:flex items-center gap-x-1">
        <Phone className="w-6 h-6" />
        <h3 className="hidden lg:block text-sm font-medium tracking-tight">
          08134276453
        </h3>
      </div>
      <Hint label={collapsed ? "Expand" : "Collapse"} side="right" asChild>
        <button
          onClick={toggleSidebar}
          className="block lg:hidden border-transparent hover:bg-secondary cursor-pointer p-2"
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </Hint>
      <Logo />
      <div className="flex gap-x-3 items-center">
        <Search />
        <Actions />
      </div>
    </nav>
  );
};

export default Navbar;
