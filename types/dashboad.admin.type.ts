import type { icons } from "lucide-react";

export type DynamicIconNameType = keyof typeof icons;

export interface DropDownMenuType {
  title: string;
  href: string;
}

export interface NavigationTypes {
  title: string;
  items: NavigationItems[];
}

export interface NavigationItems {
  title: string;
  label?: string;
  href?: string;
  iconName: DynamicIconNameType;
  items?: NavigationSubItem[];
}

export interface NavigationSubItem {
  title: string;
  label?: string;
  href: string;
}

export interface CategoryBaseType {
  name: string;
  slug: string;
}

export interface CategoryList extends CategoryBaseType {
  id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryUpdate extends CategoryBaseType {
  id: string;
}

export interface QueryParamsBase {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface CategoryQueryParams extends QueryParamsBase {
  searchBy?: "name" | "slug";
  sortBy?: "name" | "slug" | "created_at" | "updated_at";
}

export interface SubCategoryQueryParams extends QueryParamsBase {
  searchBy?: "name" | "slug" | "category";
  sortBy?: "name" | "slug" | "category" | "created_at" | "updated_at";
}

export interface SubcategoryBaseType {
  name: string;
  slug: string;
  category_id: string;
}

export interface SubcategoryList extends SubcategoryBaseType {
  id: string;
  category: {
    name: string;
  };
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface SubcategoryUpdate extends SubcategoryBaseType {
  id: string;
}
