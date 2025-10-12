import React from "react";
import { Search } from "lucide-react";

import { useSizes } from "@/hooks/useSizes";
import { SizeList } from "@/types/dashboad.admin.type";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/convertNumberIDR";

type ProductsListProsp = {
  search: string;
  minPrice: string;
  maxPrice: string;
  sizes: string[];
  handleOnChangeFiltered: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeSizeFilter: (id: string) => void;
  resetFiltered: () => void;
  btnResetFilter: boolean;
};

const FiltersMobileProducts = ({
  minPrice,
  maxPrice,
  search,
  sizes,
  handleChangeSizeFilter,
  handleOnChangeFiltered,
  resetFiltered,
  btnResetFilter,
}: ProductsListProsp) => {
  const { useGetSizes } = useSizes();
  const {
    data: sizesData,
    isLoading,
    isError,
  } = useGetSizes({ limit: undefined });
  return (
    <div className="p-3 mt-2">
      <h2 className="text-sm uppercase font-semibold">Filters</h2>
      <div className="space-y-4 mb-4 mt-3">
        <div>
          <Label className="text-muted-foreground text-xs font-semibold">
            Search
          </Label>
          <div className="relative">
            <Input
              type="text"
              className="bg-primary-foreground pr-10 text-sm"
              placeholder="Search..."
              name="search"
              value={search}
              onChange={handleOnChangeFiltered}
            />
            <Button
              className="absolute right-0 top-0 rounded-l-none bg-muted-foreground"
              size="icon"
            >
              <Search className="text-primary-foreground" />
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-muted-foreground text-xs font-semibold">
            Price
          </Label>
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                className="bg-primary-foreground pr-9 text-sm"
                placeholder="Minimum price"
                name="minPrice"
                value={formatNumber(minPrice)}
                onChange={handleOnChangeFiltered}
              />
              <div className="absolute top-1 right-1.5">
                <span className="text-muted-foreground font-semibold text-sm">
                  Rp
                </span>
              </div>
            </div>
            <div className="relative">
              <Input
                type="text"
                className="bg-primary-foreground pr-9 text-sm"
                placeholder="Maximum price"
                name="maxPrice"
                value={formatNumber(maxPrice)}
                onChange={handleOnChangeFiltered}
              />
              <div className="absolute top-1 right-1.5">
                <span className="text-muted-foreground font-semibold text-sm">
                  Rp
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Label className="text-muted-foreground text-xs font-semibold">
            Sizes
          </Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {!isLoading && !isError && sizesData.data
              ? sizesData.data.map((item: SizeList) => (
                  <div className="flex items-center gap-2" key={item.id}>
                    <Checkbox
                      id={item.id}
                      checked={sizes.includes(item.id)}
                      onCheckedChange={() => handleChangeSizeFilter(item.id)}
                    />
                    <Label htmlFor={item.id}>{item.size}</Label>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="mt-5">
          <Button
            disabled={!btnResetFilter}
            onClick={resetFiltered}
            type="button"
            size="sm"
            variant="destructive"
          >
            Reset filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersMobileProducts;
