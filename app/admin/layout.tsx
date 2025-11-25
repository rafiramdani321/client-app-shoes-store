"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Role } from "@/constants";
import NavbarAdmin from "./_components/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken, user, isAuthResolved } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthResolved) return;

    const isAdmin =
      user?.payload.role === Role.ADMIN ||
      user?.payload.role === Role.SUPERADMIN;

    if (!accessToken || !user || !isAdmin) {
      router.replace("/");
    }
  }, [accessToken, user, isAuthResolved, router]);

  const isAdmin =
    user?.payload.role === Role.ADMIN || user?.payload.role === Role.SUPERADMIN;

  if (!isAuthResolved || !accessToken || !user || !isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavbarAdmin />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
