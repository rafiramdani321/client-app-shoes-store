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
import { CategoryList, SizeList } from "@/types/dashboad.admin.type";
import { useCategories } from "@/hooks/useCategories";
import PaginationControl from "../../../_components/pagination-control";
import { Hint } from "@/components/hint";
import {
  getColumnsVisibility,
  setColumnsVisibility,
} from "@/lib/local-storage.helper";
import { useSizes } from "@/hooks/useSizes";
import ButtonColumnVisibility from "./btn-column-visibility";
import ButtonDeleteDialog from "./btn-delete-dialog";

type DataTableProps = {
  columns: ColumnDef<SizeList>[];
  data: SizeList[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  deleteManySizes: ReturnType<typeof useSizes>["deleteManySizes"];
  onPageChange: (page: number) => void;
  isLoading: boolean;
};

export function DataTableSize({
  columns,
  data,
  meta,
  onPageChange,
  isLoading,
  deleteManySizes,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => getColumnsVisibility("sizesColumns"));

  React.useEffect(() => {
    setColumnsVisibility("sizesColumns", columnVisibility);
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
        <Hint asChild label="Add Size" side="right">
          <Link
            href="/admin/pages/sizes/add"
            className="border p-1 rounded-md hover:bg-muted"
          >
            <Plus />
          </Link>
        </Hint>
        <ButtonColumnVisibility table={table} />
      </div>
      <ButtonDeleteDialog
        rowSelection={rowSelection}
        deleteManySizes={deleteManySizes}
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
