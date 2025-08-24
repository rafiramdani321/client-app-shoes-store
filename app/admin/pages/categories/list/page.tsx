"use client";

import React from "react";

import { useCategories } from "@/hooks/useCategories";
import { DataTableCategories } from "../_components/data-table";
import { CategoryColumns } from "../_components/columns";
import { getPagination, setPagination } from "@/lib/local-storage.helper";

const Categories = () => {
  const { useGetCategories, deleteCategory, deleteManyCategory } =
    useCategories();

  const [page, setPage] = React.useState(() => getPagination("categories"));
  React.useEffect(() => {
    setPagination("categories", page);
  }, [page]);
  const limit = 2;
  const [sortBy, setSortBy] = React.useState<
    "name" | "slug" | "created_at" | "updated_at" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | undefined>(
    undefined
  );

  const [searchBy, setSearchBy] = React.useState<"name" | "slug" | "all">(
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

  const { data, isLoading, isError } = useGetCategories({
    page,
    limit,
    sortBy,
    sortOrder,
    searchBy: searchBy === "all" ? undefined : searchBy,
    search,
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {isError && <p className="text-red-500">Error loading data...</p>}

      <DataTableCategories
        columns={CategoryColumns({
          onDelete: (id) => deleteCategory.mutate(id),
          onSort: (key) => {
            setSortBy(key);
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          },
          sortBy,
        })}
        data={data?.data ?? []}
        meta={data?.meta ?? {}}
        deleteManyCategory={deleteManyCategory}
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

export default Categories;
