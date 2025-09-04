"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryList } from "@/types/dashboad.admin.type";
import { useCategories } from "@/hooks/useCategories";
import SearchBar from "./search";
import ButtonDeleteDialog from "./btn-delete-dialog";
import ButtonColumnVisibility from "./btn-column-visibility";
import PaginationControl from "../../../_components/pagination-control";
import { Hint } from "@/components/hint";
import {
  getColumnsVisibility,
  setColumnsVisibility,
} from "@/lib/local-storage.helper";

type DataTableProps = {
  columns: ColumnDef<CategoryList>[];
  data: CategoryList[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  deleteManyCategory: ReturnType<typeof useCategories>["deleteManyCategory"];
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchBy: "name" | "slug" | "all";
  setSearchBy: React.Dispatch<React.SetStateAction<"name" | "slug" | "all">>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

export function DataTableCategories({
  columns,
  data,
  meta,
  deleteManyCategory,
  onPageChange,
  isLoading,
  searchBy,
  setSearchBy,
  searchInput,
  setSearchInput,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() =>
      getColumnsVisibility("categoriesColumns")
    );

  React.useEffect(() => {
    setColumnsVisibility("categoriesColumns", columnVisibility);
  }, [columnVisibility]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-x-2 justify-between">
        <Hint asChild label="Add category" side="right">
          <Link
            href="/admin/pages/categories/add"
            className="border p-1 rounded-md hover:bg-muted"
          >
            <Plus />
          </Link>
        </Hint>
        <SearchBar
          searchBy={searchBy}
          searchInput={searchInput}
          setSearchBy={setSearchBy}
          setSearchInput={setSearchInput}
        />
        <ButtonColumnVisibility table={table} />
      </div>
      <ButtonDeleteDialog
        rowSelection={rowSelection}
        deleteManyCategory={deleteManyCategory}
        setRowSelection={setRowSelection}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <PaginationControl meta={meta} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
