import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationControlProps {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

const PaginationControl = ({ meta, onPageChange }: PaginationControlProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <Button
        variant="outline"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        Prev
      </Button>
      <span className="mx-3 text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </span>
      <Button
        variant="outline"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationControl;
