"use client";

import * as React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RolesList } from "@/types/dashboad.admin.type";

export const RolesColumns = ({
  onSort,
  sortBy,
}: {
  onSort: (field: "name" | "created_at") => void;
  sortBy?: "name" | "created_at";
}): ColumnDef<RolesList>[] => [
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
    accessorKey: "created_at",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("created_at")}
        >
          Created At
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
];
