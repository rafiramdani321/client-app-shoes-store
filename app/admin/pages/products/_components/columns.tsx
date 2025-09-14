"use client";

import * as React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductListType } from "@/types/dashboad.admin.type";
import ProductActions from "./actions";

type Sort =
  | "title"
  | "slug"
  | "price"
  | "category"
  | "sub_category"
  | "created_at"
  | "updated_at";

export const ProductColumns = ({
  onDelete,
  onSort,
  sortBy,
}: {
  onDelete: (id: string) => void;
  onSort: (field: Sort) => void;
  sortBy?: Sort;
}): ColumnDef<ProductListType>[] => [
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
    accessorKey: "title",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("title")}
        >
          Title
          <ArrowUpDown className={cn(sortBy === "title" && "text-primary")} />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "slug",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("slug")}
        >
          Slug
          <ArrowUpDown className={cn(sortBy === "slug" && "text-primary")} />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("slug")}</div>,
  },
  {
    accessorKey: "price",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("price")}
        >
          Price
          <ArrowUpDown className={cn(sortBy === "price" && "text-primary")} />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("price")}</div>,
  },
  {
    accessorFn: (row) => row.category?.name,
    id: "categoryName",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("category")}
        >
          Category
          <ArrowUpDown
            className={cn(sortBy === "category" && "text-primary")}
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("categoryName")}</div>,
  },
  {
    accessorFn: (row) => row.sub_category?.name,
    id: "subCategoryName",
    header: () => {
      return (
        <Button
          variant="none"
          className="p-0 hover:text-primary"
          onClick={() => onSort("sub_category")}
        >
          Sub category
          <ArrowUpDown
            className={cn(sortBy === "sub_category" && "text-primary")}
          />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("subCategoryName")}</div>,
  },
  {
    accessorFn: (row) => (row.is_active ? "true" : "false"),
    id: "is_active",
    header: "Is Active",
    cell: ({ row }) => <div>{row.getValue("is_active")}</div>,
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
      const product = row.original;

      return <ProductActions onDelete={onDelete} product={product} />;
    },
  },
];
