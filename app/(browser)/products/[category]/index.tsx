"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { unformatNumber } from "@/lib/convertNumberIDR";
import { dropdownMenuSortByProduct } from "@/data/home";
import { ProductListType, ProductQueryParams } from "@/types/product.type";
import AppBreadcrumb from "@/components/appBreadcrumb";
import ProductCard from "../../(home)/_components/product-card";
import { Pagination } from "@/components/pagination";
import FiltersProducts from "../_components/filters-products";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isDefaultSort } from "@/lib/isDefaultSort";
import FiltersMobileProducts from "../_components/filters-mobile-products";

type ProductsListProps = {
  data: ProductListType[];
  meta: {
    page: number;
    total: number;
    limit: number;
    totalPages: number;
  };
  queryParams: {
    sortBy: ProductQueryParams["sortBy"];
    sortOrder: "asc" | "desc";
  };
  breadcrumbItems: {
    label: string;
    href?: string;
  }[];
};

const ProductsCategoryList = ({
  data,
  meta,
  queryParams,
  breadcrumbItems,
}: ProductsListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStateFiltered = {
    search: searchParams.get("search") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    size: [] as string[],
  };

  const [filterState, setFilterState] = React.useState(initialStateFiltered);
  const [btnResetFilter, setBtnResetFilter] = React.useState(false);
  const [openFilters, setOpenFilters] = React.useState(false);

  const handleOnChangeFiltered = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "minPrice" || name === "maxPrice") {
      const numericValue = unformatNumber(value);

      if (!/^\d*$/.test(numericValue)) return;

      setFilterState((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFilterState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChangeSizeFilter = (id: string) => {
    setFilterState((prev) => {
      const exists = prev.size.includes(id);
      return {
        ...prev,
        size: exists ? prev.size.filter((s) => s !== id) : [...prev.size, id],
      };
    });
  };

  React.useEffect(() => {
    if (
      filterState.search ||
      filterState.minPrice ||
      filterState.maxPrice ||
      filterState.size.length > 0 ||
      !isDefaultSort(searchParams)
    ) {
      setBtnResetFilter(true);
    } else {
      setBtnResetFilter(false);
    }
  }, [filterState, searchParams]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());

      const syncParam = (key: keyof typeof filterState) => {
        const current = searchParams.get(key) || "";
        const value = filterState[key];
        if (value && value !== current) {
          newParams.set(key, value.toString());
          newParams.set("page", "1");
        } else if (!value && current) {
          newParams.delete(key);
        }
      };

      syncParam("search");
      syncParam("minPrice");
      syncParam("maxPrice");

      if (filterState.size.length > 0) {
        newParams.delete("sizes");
        filterState.size.forEach((s) => newParams.append("sizes", s));
        if (
          searchParams.getAll("sizes").sort().join(",") !==
          filterState.size.sort().join(",")
        ) {
          newParams.set("page", "1");
        }
      } else {
        newParams.delete("sizes");
      }

      router.push(`?${newParams.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [filterState, searchParams]);

  const handleSort = (
    sortBy: Exclude<ProductQueryParams["sortBy"], undefined>,
    sortOrder: "asc" | "desc"
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sortBy", sortBy);
    newParams.set("sortOrder", sortOrder);
    newParams.set("page", "1");
    router.push(`?${newParams.toString()}`);
  };

  const resetFiltered = () => {
    setFilterState({
      search: "",
      maxPrice: "",
      minPrice: "",
      size: [],
    });

    const newParams = new URLSearchParams();

    // reset default
    newParams.set("page", "1");
    newParams.set("sortBy", "created_at");
    newParams.set("sortOrder", "desc");

    setBtnResetFilter(false);

    router.push(`?${newParams.toString()}`);
  };

  const defaultSort = { sortBy: "created_at", sortOrder: "desc" as const };

  const activeSort =
    dropdownMenuSortByProduct.find(
      (item) =>
        item.sortBy === queryParams.sortBy &&
        item.sortOrder === queryParams.sortOrder
    ) ||
    dropdownMenuSortByProduct.find(
      (item) =>
        item.sortBy === defaultSort.sortBy &&
        item.sortOrder === defaultSort.sortOrder
    );

  const activeFilterCount =
    (filterState.search ? 1 : 0) +
    (filterState.minPrice ? 1 : 0) +
    (filterState.maxPrice ? 1 : 0) +
    (filterState.size.length > 0 ? 1 : 0);

  return (
    <>
      <div className="w-full px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64">
        <div className="mb-5 hidden md:block">
          <AppBreadcrumb items={breadcrumbItems} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] xl:grid-cols-[20%_80%] gap-4">
          <FiltersProducts
            data={data}
            search={filterState.search}
            maxPrice={filterState.maxPrice}
            minPrice={filterState.minPrice}
            sizes={filterState.size}
            handleChangeSizeFilter={(id: string) => handleChangeSizeFilter(id)}
            handleOnChangeFiltered={handleOnChangeFiltered}
            resetFilterd={resetFiltered}
            btnResetFilter={btnResetFilter}
          />
          {data.length > 0 && meta.page ? (
            <div>
              <div className="flex w-full justify-between items-center">
                <h3 className="text-sm text-muted-foreground hidden lg:block">{`Showing ${meta.total} items for "${data[0]?.category.name}" (${meta.page} - ${meta.totalPages} of ${meta.total})`}</h3>
                <div className="lg:hidden">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-sm relative"
                    onClick={() => setOpenFilters(!openFilters)}
                  >
                    <SlidersHorizontal />
                    Filters
                    {activeFilterCount > 0 ? (
                      <span className="absolute left-0 -top-2 border bg-secondary-foreground text-primary-foreground text-xs px-1 rounded-full">
                        {activeFilterCount}
                      </span>
                    ) : null}
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-sm" size="sm">
                      {activeSort ? activeSort.name : "Sort by"}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 space-y-2" align="end">
                    {dropdownMenuSortByProduct.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        className={cn(
                          "cursor-pointer",
                          item.sortBy === queryParams.sortBy &&
                            item.sortOrder === queryParams.sortOrder &&
                            "bg-muted"
                        )}
                        onClick={() => handleSort(item.sortBy, item.sortOrder)}
                      >
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5">
                {data.map((product, i) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                    className={{
                      sizeTitle: "text-xs md:text-sm",
                    }}
                  />
                ))}
              </div>

              <Pagination page={meta.page} totalPages={meta.totalPages} />
            </div>
          ) : (
            <p className="text-muted-foreground text-center font-semibold">
              No products found
            </p>
          )}
        </div>
      </div>

      {/* Open filters mobile */}
      <div
        className={cn(
          "fixed lg:hidden bottom-0 left-0 right-0 bg-secondary transition-all duration-300 overflow-y-auto shadow-[0_-2px_8px_rgba(0,0,0,0.1)]",
          openFilters ? "h-72" : "h-0"
        )}
      >
        <FiltersMobileProducts
          search={filterState.search}
          maxPrice={filterState.maxPrice}
          minPrice={filterState.minPrice}
          sizes={filterState.size}
          handleChangeSizeFilter={(id: string) => handleChangeSizeFilter(id)}
          handleOnChangeFiltered={handleOnChangeFiltered}
          resetFiltered={resetFiltered}
          btnResetFilter={btnResetFilter}
        />
      </div>
    </>
  );
};

export default ProductsCategoryList;
