"use client";

import { useRoles } from "@/hooks/useRoles";
import React from "react";
import { DataTableRoles } from "./_components/data-table";
import { RolesColumns } from "./_components/columns";
import { getPagination, setPagination } from "@/lib/local-storage.helper";

const Role = () => {
  const { useGetRoles } = useRoles();
  const [page, setPage] = React.useState(() => getPagination("roles"));
  React.useEffect(() => {
    setPagination("roles", page);
  }, [page]);
  const limit = 3;
  const [sortBy, setSortBy] = React.useState<"name" | "created_at" | undefined>(
    undefined
  );
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | undefined>(
    undefined
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

  const { data, isLoading, isError } = useGetRoles({
    page,
    limit,
    sortBy,
    sortOrder,
    search,
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Roles</h1>
      {isError && <p className="text-red-500">Error loading data...</p>}

      <DataTableRoles
        columns={RolesColumns({
          onSort: (key) => {
            setSortBy(key);
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          },
          sortBy,
        })}
        data={data?.data ?? []}
        meta={data?.meta ?? []}
        onPageChange={setPage}
        isLoading={isLoading}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    </div>
  );
};

export default Role;
