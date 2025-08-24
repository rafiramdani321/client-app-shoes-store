"use client";

import React from "react";
import { useMediaQuery } from "usehooks-ts";

import { useSidebar } from "@/stores/useSidebar";

const Container = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);

  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!collapsed) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      html.style.touchAction = "none";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
      html.style.touchAction = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      html.style.touchAction = "";
    };
  }, [collapsed]);

  React.useEffect(() => {
    if (isDesktop && !collapsed) {
      onCollapse();
    }
  }, [isDesktop, collapsed, onCollapse]);

  return (
    <>
      <div className="w-full">{children}</div>
      {!collapsed && (
        <div
          onClick={onCollapse}
          className="fixed inset-0 bg-primary/50 z-40 lg:hidden"
        />
      )}
    </>
  );
};

export default Container;
