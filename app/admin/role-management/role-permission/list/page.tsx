"use client";

import { useRolePermissions } from "@/hooks/useRolePermissions";
import { getPagination, setPagination } from "@/lib/local-storage.helper";
import React from "react";
import { DataTableRolePermissions } from "../_components/data-table";
import { RolePermissionColumns } from "../_components/columns";

const RolePermissions = () => {
  const {
    useGetRolePermissions,
    useDeleteRolePermission,
    useDeleteManyRolePermission,
  } = useRolePermissions();

  const [page, setPage] = React.useState(() =>
    getPagination("role-permissions")
  );
  React.useEffect(() => {
    setPagination("role-permissions", page);
  }, [page]);
  const limit = 5;
  const [sortBy, setSortBy] = React.useState<
    | "role_name"
    | "permission_name"
    | "permission_module"
    | "created_at"
    | "updated_at"
    | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | undefined>(
    undefined
  );
  const [searchBy, setSearchBy] = React.useState<
    "role_name" | "permission_name" | "permission_module" | "all"
  >("all");
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

  const { data, isLoading, isError } = useGetRolePermissions({
    page,
    limit,
    sortBy,
    sortOrder,
    searchBy: searchBy === "all" ? undefined : searchBy,
    search,
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Role Permissions</h1>
      {isError && <p className="text-red-500">Error loading data...</p>}
      <DataTableRolePermissions
        columns={RolePermissionColumns({
          onDelete: (id) => useDeleteRolePermission.mutate(id),
          onSort: (key) => {
            setSortBy(key);
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          },
          sortBy,
        })}
        data={data?.data ?? []}
        meta={data?.meta ?? []}
        isLoading={isLoading}
        onPageChange={setPage}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        deleteManyRolePermissions={useDeleteManyRolePermission}
      />
    </div>
  );
};

export default RolePermissions;
