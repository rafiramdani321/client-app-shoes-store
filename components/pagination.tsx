"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import React from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
};

export const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const delta = 2;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  const getNumbersPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    pages.push(1);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center lg:justify-end gap-2 mt-8">
      <Button
        size={"sm"}
        variant={"outline"}
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </Button>

      {getNumbersPages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={`page-${p}`}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => handlePageChange(p as number)}
          >
            {p}
          </Button>
        )
      )}

      <Button
        size={"sm"}
        variant={"outline"}
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
};
