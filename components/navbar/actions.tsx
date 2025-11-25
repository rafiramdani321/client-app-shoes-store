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
import { useCarts } from "@/hooks/useCarts";
import { useCartSideBar } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";
import { SkeletonActions } from "./skeleton-actions";

const Actions = () => {
  const router = useRouter();
  const { accessToken, isAuthResolved, clearAccessToken, user } =
    useAuthStore();
  const { useGetCartsByUser } = useCarts();
  const { collapsed, onCollapse, onExpand } = useCartSideBar((state) => state);
  const isLoggedIn = !!accessToken;
  const [loading, setLoading] = React.useState(false);

  const { data } = useGetCartsByUser(isLoggedIn);

  if (!isAuthResolved) return <SkeletonActions />;

  const toggleCartSidebar = () => {
    if (!isLoggedIn) {
      router.replace("/auth/signin");
      return;
    }
    collapsed ? onExpand() : onCollapse();
  };

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
          <button className="relative" onClick={toggleCartSidebar}>
            {data?.CartItem.length > 0 ? (
              <span
                className="absolute bg-primary border rounded-md -top-1
             text-secondary text-[10px] -right-2 w-[22px] text-center truncate"
              >
                {data?.CartItem.length}
              </span>
            ) : null}
            <Handbag className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer mr-1" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-md">
                <User className="!w-5 !h-5 sm:!w-6 sm:!h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                {user?.payload.role === Role.ADMIN ||
                user?.payload.role === Role.SUPERADMIN ? (
                  <Link href="/admin/dashboard/analytics">
                    <DropdownMenuItem className="cursor-pointer">
                      Admin Dashboard
                    </DropdownMenuItem>
                  </Link>
                ) : null}
                <Link href="/u/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/#">
                  <DropdownMenuItem className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
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
