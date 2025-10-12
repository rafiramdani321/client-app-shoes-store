import { DropdownMenuSortByProductType } from "@/types/product.type";

export const dropdownMenuSortByProduct: DropdownMenuSortByProductType[] = [
  {
    id: 1,
    name: "Latest",
    sortBy: "created_at",
    sortOrder: "desc",
    value: "latest",
  },
  {
    id: 3,
    name: "Price : High to low",
    sortBy: "price",
    sortOrder: "desc",
    value: "price-high-to-low",
  },
  {
    id: 4,
    name: "Price: Low to high",
    sortBy: "price",
    sortOrder: "asc",
    value: "price-low-to-high",
  },
];
