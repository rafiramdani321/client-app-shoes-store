"use client";

import React from "react";
import { cn } from "@/lib/utils";

import { useCartSideBar } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { CartsListType } from "@/types/cart.type";

type CartsListProps = {
  data: CartsListType;
  isPendingDeleteCart: boolean;
  children: React.ReactNode;
};

const WrapperCartSidebar = ({
  data,
  isPendingDeleteCart,
  children,
}: CartsListProps) => {
  const { collapsed, onCollapse } = useCartSideBar((state) => state);

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

  const subTotal = data?.CartItem.reduce(
    (acc, item) => acc + item.total_price,
    0
  );
  return (
    <>
      <aside
        className={cn(
          "fixed top-[65px] md:top-[67px] right-0 h-[calc(100vh-65px)] z-50 bg-background w-[300px] md:w-[450px] xl:w-[500px] transform transition-transform duration-300 shadow-lg flex flex-col border-t rounded-tl-md",
          collapsed ? "translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex-1 overflow-y-auto">{children}</div>
        {/* Footer checkout */}
        <div className="border-t bg-background px-3 py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.1)]">
          <span className="text-base font-semibold">
            Sub total :{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(Number(subTotal))}
          </span>
          <Button
            disabled={isPendingDeleteCart}
            className="w-full font-semibold uppercase mt-3"
          >
            Checkout All
          </Button>
        </div>
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

export default WrapperCartSidebar;
