"use client";

import React from "react";
import Link from "next/link";
import { Handbag, User } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { apiFetch } from "@/lib/api";
import { showToastError } from "@/lib/toast";
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
import { Role } from "@/constants";

const Actions = () => {
  const { accessToken, isAuthResolved, clearAccessToken, user } =
    useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const isLoggedIn = !!accessToken;
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
    <>
      {!isLoggedIn ? (
        <Link
          href="/auth/signin"
          className="uppercase font-semibold hover:underline"
        >
          Signin
        </Link>
      ) : (
        <div className="flex items-center">
          <Handbag className="w-6 h-6 cursor-pointer mr-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-md">
                <User className="!w-6 !h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                {user?.role === Role.ADMIN || user?.role === Role.SUPERADMIN ? (
                  <DropdownMenuItem>
                    <Link href="/admin/dashboard/analytics">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={loading}
                onClick={() => handleLogout()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};

export default Actions;
