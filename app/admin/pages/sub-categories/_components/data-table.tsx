"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubcategoryList } from "@/types/dashboad.admin.type";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Hint } from "@/components/hint";
import PaginationControl from "../../_components/pagination-control";
import ButtonColumnVisibility from "./btn-column-visibility";
import {
  getColumnsVisibility,
  setColumnsVisibility,
} from "@/lib/local-storage.helper";
import { useSubCategories } from "@/hooks/useSubCategories";
import ButtonDeleteDialog from "./btn-delete-dialog";
import SearchBar from "./search";

type DataTableProps = {
  columns: ColumnDef<SubcategoryList>[];
  data: SubcategoryList[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  deleteManySubCategory: ReturnType<
    typeof useSubCategories
  >["useDeleteManySubcategories"];
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchBy: "name" | "slug" | "category" | "all";
  setSearchBy: React.Dispatch<
    React.SetStateAction<"name" | "slug" | "category" | "all">
  >;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

export function DataTableSubCategories({
  columns,
  data,
  meta,
  deleteManySubCategory,
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
      getColumnsVisibility("subcategoriesColumns")
    );

  React.useEffect(() => {
    setColumnsVisibility("subcategoriesColumns", columnVisibility);
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
        <Hint asChild label="Add sub category" side="right">
          <Link
            href="/admin/pages/sub-categories/add"
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
        deleteManySubCategory={deleteManySubCategory}
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
