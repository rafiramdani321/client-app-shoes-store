export interface QueryParamsBase {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProductQueryParams extends QueryParamsBase {
  searchBy?: "title" | "slug" | "category" | "sub_category";
  sortBy?:
    | "title"
    | "slug"
    | "price"
    | "category"
    | "sub_category"
    | "created_at"
    | "updated_at";
}

export interface ProductQueryParamsCategorySlug extends QueryParamsBase {
  category_slug: string;
  sortBy?: "created_at" | "price";
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
}

export interface ProductQueryParamsSubCategorySlug extends QueryParamsBase {
  category_slug: string;
  subcategory_slug: string;
  sortBy?: "created_at" | "price";
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
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

export interface ProductListType extends ProductBaseType {
  id: string;
  category: {
    name: string;
    slug: string;
  };
  sub_category: {
    name: string;
    slug: string;
  };
  ProductImage: {
    id: string;
    url: string;
    fileId: string;
  }[];
  ProductSize: {
    id: string;
    size: {
      id: string;
      size: string;
    };
    stock: number;
  }[];
}

export interface ProductResponse {
  data: ProductListType[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DropdownMenuSortByProductType {
  id: number;
  name: string;
  sortBy: "created_at" | "price";
  sortOrder: "asc" | "desc";
  value: string;
}
