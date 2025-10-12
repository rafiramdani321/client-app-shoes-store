import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonActions = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Handbag icon skeleton */}
      <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-md" />
      {/* User icon skeleton */}
      <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-md" />
    </div>
  );
};
