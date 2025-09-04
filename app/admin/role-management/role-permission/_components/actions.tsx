import React from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RolePermissionList,
  SubcategoryList,
} from "@/types/dashboad.admin.type";
import DeleteDialog from "@/components/delete-dialog";

export default function RolePermissionActions({
  rolePermission,
  onDelete,
}: {
  rolePermission: RolePermissionList;
  onDelete: (id: string) => void;
}) {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  return (
    <>
      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href={`/admin/role-management/role-permission/update/${rolePermission.id}`}
            >
              Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              setOpenMenu(false);
              setTimeout(() => setOpenDialog(true), 0);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        id={rolePermission.id}
        title={`role permission ${rolePermission.role.name}`}
        onDelete={onDelete}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
}
