import React from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { CategoryList, SizeList } from "@/types/dashboad.admin.type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/delete-dialog";

export default function SizeActions({
  size,
  onDelete,
}: {
  size: SizeList;
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
            <Link href={`/admin/pages/sizes/update/${size.id}`}>Update</Link>
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
        id={size.id}
        title={`size ${size.size}`}
        onDelete={onDelete}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
}
