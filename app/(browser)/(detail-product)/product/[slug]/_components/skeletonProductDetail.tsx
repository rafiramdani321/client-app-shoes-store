import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonProductDetail = () => {
  return (
    <div className="mt-24 md:mt-28 lg:mt-44">
      <div className="w-full px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64 animate-pulse">
        {/* Breadcrumb */}
        <Skeleton className="h-4 w-40 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-[30%_40%_30%] xl:grid-cols-[25%_50%_25%] gap-5">
          {/* Left: Images */}
          <div className="space-y-3">
            <Skeleton className="w-full h-64 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="w-16 h-16 rounded-md" />
              <Skeleton className="w-16 h-16 rounded-md" />
              <Skeleton className="w-16 h-16 rounded-md" />
            </div>
          </div>

          {/* Middle: Product Info */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-1/3" />

            {/* Sizes */}
            <div className="mt-6">
              <Skeleton className="h-4 w-20 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="w-12 h-8 rounded" />
                <Skeleton className="w-12 h-8 rounded" />
                <Skeleton className="w-12 h-8 rounded" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Reviews */}
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          {/* Right: Checkout Card */}
          <div className="h-fit border shadow-md rounded-md p-4 space-y-3 hidden lg:block">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductDetail;
