"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, user, isAuthResolved } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthResolved) return;

    if (!accessToken || !user) {
      router.replace("/");
    }
  }, [accessToken, user, isAuthResolved, router]);

  if (!isAuthResolved || !accessToken || !user) {
    return null;
  }

  return <>{children}</>;
}
