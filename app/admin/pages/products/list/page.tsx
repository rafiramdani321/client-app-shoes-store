"use client";

import { useProducts } from "@/hooks/useProducts";
import { getPagination, setPagination } from "@/lib/local-storage.helper";
import React from "react";
import { DataTableProducts } from "../_components/data-table";
import { ProductColumns } from "../_components/columns";
import LoadingSpinner from "@/components/loadingSpinner";

const Products = () => {
  const { useGetProducts, useDeleteProductById, useDeleteManyProducts } =
    useProducts();

  const [page, setPage] = React.useState(() => getPagination("products"));
  React.useEffect(() => {
    setPagination("products", page);
  }, [page]);
  const limit = 5;
  const [sortBy, setSortBy] = React.useState<
    | "title"
    | "slug"
    | "price"
    | "category"
    | "sub_category"
    | "created_at"
    | "updated_at"
    | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | undefined>(
    undefined
  );
  const [searchBy, setSearchBy] = React.useState<
    "title" | "slug" | "category" | "sub_category" | "all"
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

  const { data, isLoading, isError } = useGetProducts({
    page,
    limit,
    sortBy,
    sortOrder,
    searchBy: searchBy === "all" ? undefined : searchBy,
    search,
  });

  const isLoadingDeleteting =
    useDeleteProductById.isPending || useDeleteManyProducts.isPending;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>
      {isError && <p className="text-red-500">Error loading data...</p>}
      <DataTableProducts
        columns={ProductColumns({
          onDelete: (id) => useDeleteProductById.mutate(id),
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
        deleteManyProducts={useDeleteManyProducts}
      />

      <LoadingSpinner isLoading={isLoadingDeleteting} />
    </div>
  );
};

export default Products;
