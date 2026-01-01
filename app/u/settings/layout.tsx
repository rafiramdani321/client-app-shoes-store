"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { navigationMenuUserSettings } from "@/data/data";
import { usePathname, useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import DialogSetPassword from "./_components/dialog-set-password";
import { DialogChangePassword } from "./profile/dialog-change-password";

const UserSettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const { useGetMyProfile } = useUsers();
  const router = useRouter();
  const pathname = usePathname();

  const [openDialogSetPassword, setOpenDialogSetPassword] =
    React.useState(false);
  const [openDialogChangePassword, setOpenDialogChangePassword] =
    React.useState(false);

  const currentValue = React.useMemo(() => {
    const segments = pathname.split("/");
    const last = segments[segments.length - 1];
    return navigationMenuUserSettings.some((item) => item.value === last)
      ? last
      : "profile";
  }, [pathname]);

  const { data, isLoading } = useGetMyProfile();

  const handleTabChange = (value: string) => {
    const target = navigationMenuUserSettings.find(
      (item) => item.value === value
    );
    if (target) router.push(`/u/settings/${target.value}`);
  };

  if (isLoading) return null;

  return (
    <>
      <DialogSetPassword
        openDialog={openDialogSetPassword}
        setOpenDialog={setOpenDialogSetPassword}
      />
      <DialogChangePassword
        openDialog={openDialogChangePassword}
        setOpenDialog={setOpenDialogChangePassword}
      />
      <div className="w-full grid grid-cols-[20%_80%] gap-x-3">
        <div className="w-full border p-4 rounded-md shadow-lg">
          <div className="flex items-center gap-x-2">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={data.data.image_url}
                alt="user-avatar"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h2 className="text-sm font-semibold truncate">
              {data.data.username}
            </h2>
          </div>
          <Separator className="my-4" />

          {data.data.auth_provider === "google" && !data.data.has_password ? (
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={() => setOpenDialogSetPassword(true)}
            >
              Set Password
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={() => setOpenDialogChangePassword(true)}
            >
              Change Password
            </Button>
          )}
        </div>
        <div>
          <Tabs
            value={currentValue}
            className="w-full"
            onValueChange={handleTabChange}
          >
            <div className="border bg-muted rounded-t-md p-1">
              <TabsList>
                {navigationMenuUserSettings.map((item) => (
                  <TabsTrigger key={item.id} value={item.value}>
                    {item.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="border rounded-b-lg p-6 shadow-md">{children}</div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserSettingsLayout;
