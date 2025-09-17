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
