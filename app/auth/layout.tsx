"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/useAuthStore";
import Navbar from "./_components/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { accessToken, user, isAuthResolved } = useAuthStore();

  React.useEffect(() => {
    if (accessToken || user) {
      router.push("/");
    }
  }, [accessToken, user]);

  if (!isAuthResolved || accessToken || user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
};

export default AuthLayout;
