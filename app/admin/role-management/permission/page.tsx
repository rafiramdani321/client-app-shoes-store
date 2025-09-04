"use client";

import { useRoles } from "@/hooks/useRoles";
import { getPagination, setPagination } from "@/lib/local-storage.helper";
import React from "react";
import { DataTablePermissions } from "./_components/data-table";
import { PermissionsColumns } from "./_components/columns";

const Permissions = () => {
  const { useGetPermissions } = useRoles();

  const [page, setPage] = React.useState(() => getPagination("permissions"));
  React.useEffect(() => {
    setPagination("permissions", page);
  }, [page]);
  const limit = 2;
  const [sortBy, setSortBy] = React.useState<
    "name" | "module" | "created_at" | "updated_at" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | undefined>(
    undefined
  );
  const [searchBy, setSearchBy] = React.useState<"name" | "module" | "all">(
    "all"
  );
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      if (searchInput.trim() !== "") {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, isError } = useGetPermissions({
    page,
    limit,
    sortBy,
    sortOrder,
    searchBy: searchBy === "all" ? undefined : searchBy,
    search,
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Permissions</h1>
      {isError && <p className="text-red-500">Error loading data...</p>}

      <DataTablePermissions
        columns={PermissionsColumns({
          onSort: (key) => {
            setSortBy(key);
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          },
          sortBy,
        })}
        data={data?.data ?? []}
        meta={data?.meta ?? {}}
        onPageChange={setPage}
        isLoading={isLoading}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    </div>
  );
};

export default Permissions;
