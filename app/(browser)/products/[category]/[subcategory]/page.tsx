import ProductsService from "@/services/products";
import { ProductQueryParamsSubCategorySlug } from "@/types/product.type";
import React from "react";
import ProductsCategoryList from "..";

type PageSubCategoryProps = {
  params: { category: string; subcategory: string };
  searchParams: {
    page?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sizes?: string[];
  };
};

const PageSubCategory = async ({
  params,
  searchParams,
}: PageSubCategoryProps) => {
  const currentPage = Number(searchParams.page) || 1;
  const currentSortBy =
    (searchParams.sortBy as ProductQueryParamsSubCategorySlug["sortBy"]) ||
    "created_at";
  const currentSortOrder = (searchParams.sortOrder as "asc" | "desc") || "desc";

  const products = await ProductsService.getProductsBySubCategorySlug({
    category_slug: params.category,
    subcategory_slug: params.subcategory,
    limit: 10,
    page: currentPage,
    search: searchParams.search,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sizes: searchParams.sizes,
  });

  const firstProduct = products?.data?.[0];
  const categorySlug = firstProduct?.category?.slug;
  const subcategorySlug = firstProduct?.sub_category?.slug;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    categorySlug
      ? { label: categorySlug, href: `/products/${categorySlug}` }
      : { label: "Category Unknown" },
    { label: subcategorySlug ?? "Sub Category Unknown" },
  ];

  return (
    <div className="mt-24 md:mt-32 lg:mt-40 xl:mt-48">
      <ProductsCategoryList
        data={products.data ?? []}
        meta={products.meta ?? {}}
        queryParams={{ sortBy: currentSortBy, sortOrder: currentSortOrder }}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
};

export default PageSubCategory;
