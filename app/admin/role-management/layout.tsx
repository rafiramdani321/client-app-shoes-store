"use client";

import { Role } from "@/constants";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import React from "react";

export default function LayoutRoleManagement({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken, user, isAuthResolved } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthResolved) return;
    const isSuperAdmin = user?.role === Role.SUPERADMIN;
    if (!accessToken || !user || !isSuperAdmin) {
      router.replace("/");
    }
  }, [accessToken, user, isAuthResolved, router]);

  const isSuperAdmin = user?.role === Role.SUPERADMIN;
  if (!isAuthResolved || !accessToken || !user || !isSuperAdmin) {
    return null;
  }

  return <div>{children}</div>;
}
