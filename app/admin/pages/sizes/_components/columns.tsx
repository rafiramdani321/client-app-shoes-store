"use client";

import * as React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SizeList } from "@/types/dashboad.admin.type";
import SizeActions from "./actions";

export const SizesColumns = ({
  onDelete,
  onSort,
  sortBy,
}: {
  onDelete: (id: string) => void;
  onSort: (field: "size" | "created_at" | "updated_at") => void;
  sortBy?: "size" | "created_at" | "updated_at";
}): ColumnDef<SizeList>[] => [
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
    accessorKey: "size",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("size")}
        >
          Size
          <ArrowUpDown className={cn(sortBy === "size" && "text-primary")} />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("size")}</div>,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("created_by")}</div>
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
    accessorKey: "updated_by",
    header: "Updated By",
    cell: ({ row }) => <div>{row.getValue("updated_by")}</div>,
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
      const size = row.original;

      return <SizeActions onDelete={onDelete} size={size} />;
    },
  },
];
