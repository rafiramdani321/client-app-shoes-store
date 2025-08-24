"use client";

import React from "react";
import { useSubCategories } from "@/hooks/useSubCategories";
import { DataTableSubCategories } from "../_components/data-table";
import { SubCategoryColumns } from "../_components/columns";
import { getPagination, setPagination } from "@/lib/local-storage.helper";

const SubCategories = () => {
  const {
    useGetSubCategories,
    useDeleteManySubcategories,
    useDeleteSubcategoryById,
  } = useSubCategories();

  const [page, setPage] = React.useState(() => getPagination("subcategories"));
  React.useEffect(() => {
    setPagination("subcategories", page);
  }, [page]);
  const limit = 2;
  const [sortBy, setSortBy] = React.useState<
    "name" | "slug" | "category" | "created_at" | "updated_at" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | undefined>(
    undefined
  );
  const [searchBy, setSearchBy] = React.useState<
    "name" | "slug" | "category" | "all"
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

  const { data, isLoading, isError } = useGetSubCategories({
    page,
    limit,
    sortBy,
    sortOrder,
    searchBy: searchBy === "all" ? undefined : searchBy,
    search,
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Sub Categories</h1>
      {isError && <p className="text-red-500">Error loading data...</p>}
      <DataTableSubCategories
        columns={SubCategoryColumns({
          onDelete: (id) => useDeleteSubcategoryById.mutate(id),
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
        deleteManySubCategory={useDeleteManySubcategories}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    </div>
  );
};

export default SubCategories;
