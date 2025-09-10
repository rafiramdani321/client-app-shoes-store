import type { icons } from "lucide-react";

export type DynamicIconNameType = keyof typeof icons;

export interface QueryParamsBase {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
}

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

export interface CategoryQueryParams extends QueryParamsBase {
  searchBy?: "name" | "slug";
  sortBy?: "name" | "slug" | "created_at" | "updated_at";
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

export interface SubCategoryQueryParams extends QueryParamsBase {
  searchBy?: "name" | "slug" | "category";
  sortBy?: "name" | "slug" | "category" | "created_at" | "updated_at";
}

export interface SizeBaseType {
  size: string;
}

export interface SizeList extends SizeBaseType {
  id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface SizeUpdate extends SizeBaseType {
  id: string;
}

export interface SizeQueryParams extends QueryParamsBase {
  sortBy?: "size" | "created_at" | "updated_at";
}

export interface RolesBaseType {
  name: string;
}

export interface RolesList extends RolesBaseType {
  id: string;
  created_at: string;
}

export interface RoleQueryParams extends QueryParamsBase {
  sortBy?: "name" | "created_at";
}

export interface PermissionsBaseType {
  name: string;
  description: string;
  module: string;
}

export interface PermissionsList extends PermissionsBaseType {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionsUpdateType extends PermissionsBaseType {
  id: string;
}

export interface PermissionsQueryParams extends QueryParamsBase {
  searchBy?: "name" | "module";
  sortBy?: "name" | "module" | "created_at" | "updated_at";
}

export interface RolePermissionQueryParams extends QueryParamsBase {
  searchBy?: "role_name" | "permission_name" | "permission_module";
  sortBy?:
    | "role_name"
    | "permission_name"
    | "permission_module"
    | "created_at"
    | "updated_at";
}

export interface RolePermissionsBaseType {
  role: {
    name: string;
  };
  permission: {
    name: string;
    module: string;
  };
}

export interface RolePermissionCreateType {
  role_id: string;
  permission_id: string;
}

export interface RolePermissionList extends RolePermissionsBaseType {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface RolePermissionUpdateType extends RolePermissionCreateType {
  id: string;
}

export interface ProductBaseType {
  title: string;
  slug: string;
  description: string;
  price: string;
  category_id: string;
  subcategory_id: string;
  is_active: boolean;
}

type SizesType = {
  size_id: string;
  stock: number;
};

export interface CreateProductType extends ProductBaseType {
  files: File[];
  sizes: SizesType[];
}
