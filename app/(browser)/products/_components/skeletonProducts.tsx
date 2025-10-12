import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonProducts = () => {
  return (
    <div className="mt-24 md:mt-32 lg:mt-40 xl:mt-48">
      <div className="w-full px-2 sm:px-6 lg:px-16 2xl:px-64">
        <div className="mb-5 hidden md:block">
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] xl:grid-cols-[20%_80%] gap-4">
          <Skeleton className="h-[400px] rounded-md hidden lg:block" />
          <div>
            <div className="flex w-full justify-between items-center">
              <Skeleton className="hidden lg:block h-5 w-[260px]" />
              <Skeleton className="lg:hidden w-20 h-10" />
              <Skeleton className="w-20 h-10" />
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton className="w-full h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProducts;
