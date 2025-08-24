"use client";

import { useSidebar } from "@/stores/useSidebar";
import clsx from "clsx";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { collapsed } = useSidebar((state) => state);
  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-full z-50 bg-background w-60 transform transition-transform duration-300 lg:hidden overflow-y-auto p-3",
        "flex flex-col",
        collapsed ? "-translate-x-full" : "translate-x-0"
      )}
    >
      {children}
    </aside>
  );
};

export default Wrapper;
