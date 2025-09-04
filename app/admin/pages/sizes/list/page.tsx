"use client";

import { useSizes } from "@/hooks/useSizes";
import { getPagination, setPagination } from "@/lib/local-storage.helper";
import React from "react";
import { DataTableSize } from "../_components/data-table";
import { SizesColumns } from "../_components/columns";

const Sizes = () => {
  const { useGetSizes, deleteSize, deleteManySizes } = useSizes();

  const [page, setPage] = React.useState(() => getPagination("sizes"));
  React.useEffect(() => {
    setPagination("sizes", page);
  }, [page]);
  const limit = 2;
  const [sortBy, setSortBy] = React.useState<
    "size" | "created_at" | "updated_at" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | undefined>(
    undefined
  );

  const { data, isLoading, isError } = useGetSizes({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Sizes</h1>
      {isError && <p className="text-red-500">Error loading data</p>}

      <DataTableSize
        columns={SizesColumns({
          onDelete: (id) => deleteSize.mutate(id),
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
        deleteManySizes={deleteManySizes}
      />
    </div>
  );
};

export default Sizes;
