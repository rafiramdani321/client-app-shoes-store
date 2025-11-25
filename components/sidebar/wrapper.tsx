"use client";

import { useSidebar } from "@/stores/useSidebar";
import clsx from "clsx";
import React from "react";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { collapsed, onCollapse } = useSidebar((state) => state);
  return (
    <>
      <aside
        className={clsx(
          "fixed top-[65px] md:top-[67px] left-0 h-full z-50 bg-background w-60 transform transition-transform duration-300 lg:hidden flex flex-col rounded-tr-md",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex-1 overflow-y-auto p-3">{children}</div>
      </aside>
      {!collapsed && (
        <div
          onClick={onCollapse}
          className="fixed inset-0 bg-primary/50 z-40"
        />
      )}
    </>
  );
};

export default Wrapper;
