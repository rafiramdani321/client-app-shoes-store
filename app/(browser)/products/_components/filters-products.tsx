"use client";

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { SubCategoryBaseType } from "@/types/categories.type";
import { useSizes } from "@/hooks/useSizes";
import { useCategories } from "@/hooks/useCategories";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SizeList } from "@/types/dashboad.admin.type";
import { Input } from "@/components/ui/input";
import { ProductListType } from "@/types/product.type";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/convertNumberIDR";

type ProductsListProps = {
  data: ProductListType[];
  search: string;
  minPrice: string;
  maxPrice: string;
  sizes: string[];
  handleOnChangeFiltered: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeSizeFilter: (id: string) => void;
  resetFilterd: () => void;
  btnResetFilter: boolean;
};

const FiltersProducts = ({
  data,
  minPrice,
  maxPrice,
  search,
  sizes,
  handleOnChangeFiltered,
  handleChangeSizeFilter,
  resetFilterd,
  btnResetFilter,
}: ProductsListProps) => {
  const { useGetSizes } = useSizes();
  const { getCategoyById } = useCategories();
  const {
    data: sizesData,
    isLoading,
    isError,
  } = useGetSizes({ limit: undefined });
  const { data: categoriesData, isLoading: isLoadingCategoriesData } =
    getCategoyById(data[0]?.category_id);
  return (
    <>
      <div className="w-full bg-muted rounded-md hidden lg:block h-fit">
        <div className="bg-primary rounded-t-md mb-5">
          <h3 className="text-secondary font-semibold p-2 uppercase text-sm">
            Filters
          </h3>
        </div>
        <div className="space-y-6 mb-4 px-2">
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold">
              Search
            </h3>
            <div className="relative mt-2">
              <Input
                type="text"
                className="bg-primary-foreground pr-10"
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
            <h3 className="text-muted-foreground text-sm font-semibold">
              Price
            </h3>
            <div className="space-y-3">
              <div className="relative mt-2">
                <Input
                  type="text"
                  className="bg-primary-foreground pr-9"
                  placeholder="Minimum price"
                  name="minPrice"
                  value={formatNumber(minPrice)}
                  onChange={handleOnChangeFiltered}
                />
                <div className="absolute top-1 right-1.5">
                  <span className="text-muted-foreground font-semibold">
                    Rp
                  </span>
                </div>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  className="bg-primary-foreground pr-9"
                  placeholder="Maximum price"
                  name="maxPrice"
                  value={formatNumber(maxPrice)}
                  onChange={handleOnChangeFiltered}
                />
                <div className="absolute top-1 right-1.5">
                  <span className="text-muted-foreground font-semibold">
                    Rp
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold">
              Sizes
            </h3>
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
              onClick={resetFilterd}
              type="button"
              size="sm"
              variant="destructive"
            >
              Reset filters
            </Button>
          </div>
          {!isLoadingCategoriesData && categoriesData?.SubCategory ? (
            <>
              <Separator />
              <div className="mt-4">
                <h3 className="text-muted-foreground text-sm font-semibold">
                  Sub categories
                </h3>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full flex flex-col mt-2 gap-3"
                >
                  {categoriesData.SubCategory.map(
                    (item: SubCategoryBaseType, i: number) => (
                      <AccordionItem
                        key={item.id}
                        value={`subcategory-${i}`}
                        className="border-none"
                      >
                        <Link
                          href={`/products/${data[0]?.category.slug || ""}/${
                            item.slug
                          }`}
                          className="text-sm capitalize hover:font-semibold"
                        >
                          {item.name}
                        </Link>
                        {i < categoriesData.SubCategory.length - 1 && (
                          <Separator />
                        )}
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default FiltersProducts;
