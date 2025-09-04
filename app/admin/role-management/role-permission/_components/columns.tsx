"use client";

import * as React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RolePermissionList } from "@/types/dashboad.admin.type";
import RolePermissionActions from "./actions";

type Sorting =
  | "role_name"
  | "permission_name"
  | "permission_module"
  | "created_at"
  | "updated_at";

export const RolePermissionColumns = ({
  onDelete,
  onSort,
  sortBy,
}: {
  onDelete: (id: string) => void;
  onSort: (field: Sorting) => void;
  sortBy?: Sorting;
}): ColumnDef<RolePermissionList>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.role.name,
    id: "roleName",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("role_name")}
        >
          Role name
          <ArrowUpDown
            className={cn(sortBy === "role_name" && "text-primary")}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("roleName")}</div>
    ),
  },
  {
    accessorFn: (row) => row.permission.name,
    id: "permissionName",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("permission_name")}
        >
          Permission name
          <ArrowUpDown
            className={cn(sortBy === "permission_name" && "text-primary")}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("permissionName")}</div>
    ),
  },
  {
    accessorFn: (row) => row.permission.module,
    id: "permissionModule",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("permission_module")}
        >
          Permission module
          <ArrowUpDown
            className={cn(sortBy === "permission_module" && "text-primary")}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("permissionModule")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("created_at")}
        >
          Create At
          <ArrowUpDown
            className={cn(sortBy === "created_at" && "text-primary")}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("created_at");
      const date = value ? new Date(value as string) : null;
      return <div>{date ? date.toLocaleString() : "-"}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("updated_at")}
        >
          Updated At
          <ArrowUpDown
            className={cn(sortBy === "updated_at" && "text-primary")}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("updated_at");
      const date = value ? new Date(value as string) : null;
      return <div>{date ? date.toLocaleString() : "-"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const rolePermissions = row.original;

      return (
        <RolePermissionActions
          onDelete={onDelete}
          rolePermission={rolePermissions}
        />
      );
    },
  },
];
