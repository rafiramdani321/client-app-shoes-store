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
import { PermissionsList } from "@/types/dashboad.admin.type";
import PaginationControl from "../../../_components/pagination-control";
import {
  getColumnsVisibility,
  setColumnsVisibility,
} from "@/lib/local-storage.helper";
import SearchBar from "./search";
import ButtonColumnVisibility from "./btn-column-visibility";

type DataTableProps = {
  columns: ColumnDef<PermissionsList>[];
  data: PermissionsList[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  isLoading: boolean;
  searchBy: "name" | "module" | "all";
  setSearchBy: React.Dispatch<React.SetStateAction<"name" | "module" | "all">>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

export function DataTablePermissions({
  columns,
  data,
  meta,
  onPageChange,
  isLoading,
  searchBy,
  setSearchBy,
  searchInput,
  setSearchInput,
}: DataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() =>
      getColumnsVisibility("permissionsColumns")
    );

  React.useEffect(() => {
    setColumnsVisibility("permissionsColumns", columnVisibility);
  }, [columnVisibility]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-x-2 justify-between">
        <SearchBar
          searchBy={searchBy}
          searchInput={searchInput}
          setSearchBy={setSearchBy}
          setSearchInput={setSearchInput}
        />
        <ButtonColumnVisibility table={table} />
      </div>
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
        <PaginationControl meta={meta} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
