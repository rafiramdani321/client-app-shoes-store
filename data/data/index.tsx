import { DropdownMenuSortByProductType } from "@/types/product.type";
import { NavigationListProfileUserSettings } from "@/types/user.type";

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

export const navigationMenuUserSettings: NavigationListProfileUserSettings[] = [
  {
    id: 1,
    title: "Profile",
    url: "/",
    value: "profile",
  },
  {
    id: 2,
    title: "Shipping Address",
    url: "/shipping-address",
    value: "shipping-address",
  },
  {
    id: 3,
    title: "Purchase History",
    url: "/purchase-history",
    value: "purchase-history",
  },
];
