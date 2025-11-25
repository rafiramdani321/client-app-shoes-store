"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCarts } from "@/hooks/useCarts";
import { useCartSideBar } from "@/stores/useCartStore";
import { CartsListType } from "@/types/cart.type";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type CartsListProps = {
  data: CartsListType;
  onDeleteCartItem: (id: string) => void;
  isPendingDelete: boolean;
};

const CartLists = ({
  data,
  onDeleteCartItem,
  isPendingDelete,
}: CartsListProps) => {
  const { onCollapse } = useCartSideBar();

  if (!data || !data.id || data.CartItem.length < 0) {
    return (
      <div className="flex w-full justify-center h-screen items-center p-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Yout cart is empty
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-3">
        <div className="flex justify-between items-center">
          <X
            className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer"
            onClick={onCollapse}
          />
          <h2 className="text-sm font-semibold uppercase">Your carts</h2>
        </div>
        <div className="mt-5">
          {data.CartItem.map((item, i) => (
            <div className="p-2" key={item.id}>
              <div className="grid grid-cols-[20%_80%] gap-3" key={item.id}>
                <div className="bg-neutral-200/30 dark:bg-black/30 flex items-center justify-center rounded-md overflow-hidden aspect-square group relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={item.product.ProductImage[0].url}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Image
                        src={item.product.ProductImage[0].url}
                        alt={item.product.ProductImage[0].url}
                        width={500}
                        height={500}
                        className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div>
                  <div className="space-y-2">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-xs font-semibold tracking-tight line-clamp-2 hover:underline"
                    >
                      {item.product.title}
                    </Link>
                    <div className="text-xs text-muted-foreground items-center grid grid-cols-1 md:grid-cols-2">
                      <span>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(item.unit_price))}
                      </span>
                      <div className="flex gap-x-2">
                        <span>Quantity : {item.quantity}</span>
                        <span>Size : {item.product_size.size.size}</span>
                      </div>
                    </div>
                    <h2 className="text-xs font-semibold tracking-tight">
                      Total price :{"  "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(item.total_price))}
                    </h2>
                  </div>
                  <div className="w-full flex justify-end gap-x-2 mt-2">
                    <Button disabled={isPendingDelete} size="sm">
                      Checkout
                    </Button>
                    <Button
                      disabled={isPendingDelete}
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteCartItem(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              {i < data.CartItem.length - 1 && (
                <Separator className="my-2 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartLists;
