"use client";

import React from "react";
import WrapperCartSidebar from "./wrapper";
import CartLists from "./cartLists";
import { useCarts } from "@/hooks/useCarts";
import { useAuthStore } from "@/stores/useAuthStore";

const CartSidebar = () => {
  const { accessToken } = useAuthStore();
  const { useGetCartsByUser, deleteCartItemById } = useCarts();
  const isLoggedIn = !!accessToken;

  const { data, isLoading, isError } = useGetCartsByUser(isLoggedIn);
  if (isError || isLoading) return null;

  return (
    <>
      <WrapperCartSidebar
        data={data}
        isPendingDeleteCart={deleteCartItemById.isPending}
      >
        <CartLists
          data={data}
          onDeleteCartItem={(id: string) => deleteCartItemById.mutateAsync(id)}
          isPendingDelete={deleteCartItemById.isPending}
        />
      </WrapperCartSidebar>
    </>
  );
};

export default CartSidebar;
