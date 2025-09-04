"use client";

import * as React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PermissionsList } from "@/types/dashboad.admin.type";

export const PermissionsColumns = ({
  onSort,
  sortBy,
}: {
  onSort: (field: "name" | "module" | "created_at" | "updated_at") => void;
  sortBy?: "name" | "module" | "created_at" | "updated_at";
}): ColumnDef<PermissionsList>[] => [
  {
    accessorKey: "name",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("name")}
        >
          Name
          <ArrowUpDown className={cn(sortBy === "name" && "text-primary")} />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "module",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("module")}
        >
          Module
          <ArrowUpDown className={cn(sortBy === "module" && "text-primary")} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("module")}</div>
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
];
