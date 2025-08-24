"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";
import { showToastError } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { dropdownMenuItems } from "@/data/admin-dashboard";
import { ThemeToggle } from "@/components/themeToggle";

const Actions = () => {
  const router = useRouter();
  const { isAuthResolved, clearAccessToken } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  if (!isAuthResolved) return null;

  const handleLogout = async () => {
    setLoading(true);

    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
      clearAccessToken();
      window.location.reload();
    } catch (error) {
      showToastError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-x-2 items-center">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-md">
            <User className="!w-6 !h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            {dropdownMenuItems.map((item, i) => (
              <DropdownMenuItem
                key={i}
                className="cursor-pointer"
                onClick={() => router.push(item.href)}
              >
                {item.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={loading} onClick={() => handleLogout()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Actions;
