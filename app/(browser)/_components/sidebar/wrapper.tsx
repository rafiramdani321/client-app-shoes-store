"use client";

import { useSidebar } from "@/stores/useSidebar";
import clsx from "clsx";
import React from "react";

const Wrapper = ({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) => {
  const { collapsed } = useSidebar((state) => state);
  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-full z-50 bg-background w-60 transform transition-transform duration-300 lg:hidden flex flex-col",
        collapsed ? "-translate-x-full" : "translate-x-0"
      )}
    >
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
      {footer}
    </aside>
  );
};

export default Wrapper;
