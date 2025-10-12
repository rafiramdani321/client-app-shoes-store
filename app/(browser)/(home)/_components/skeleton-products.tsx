import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonProducts = () => {
  return (
    <section className="w-full px-2">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 space-y-2"
          >
            <Skeleton className="h-[12rem] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkeletonProducts;
