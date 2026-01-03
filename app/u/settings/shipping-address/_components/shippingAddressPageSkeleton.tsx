import { Skeleton } from "@/components/ui/skeleton";

export function ShippingAddressSkeleton() {
  return (
    <div className="w-full border rounded-md">
      <div className="p-3 space-y-3">
        <div className="flex justify-between">
          <div className="w-[70%] space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-full" />
          </div>

          <div className="flex gap-x-2">
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-8 w-14" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
