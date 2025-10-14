import React from "react";

import ProductsService from "@/services/products";
import { ProductQueryParamsCategorySlug } from "@/types/product.type";
import ProductsCategoryList from ".";

type PageCategoryProps = {
  params: { category: string };
  searchParams: {
    page?: string;
    sortBy?: string;
    sortOrder: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sizes?: string[];
  };
};

const PageCategory = async ({ params, searchParams }: PageCategoryProps) => {
  const currentPage = Number(searchParams.page) || 1;
  const currentSortBy =
    (searchParams.sortBy as ProductQueryParamsCategorySlug["sortBy"]) ||
    "created_at";
  const currentSortOrder = (searchParams.sortOrder as "asc" | "desc") || "desc";

  const products = await ProductsService.getProductsByCategorySlug({
    category_slug: params.category,
    limit: 10,
    page: currentPage,
    search: searchParams.search,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sizes: searchParams.sizes,
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(products.data.length > 0
      ? [{ label: products.data[0].category.slug }]
      : [{ label: "Category Unknown" }]),
  ];

  return (
    <div className="mt-24 md:mt-32 lg:mt-40 xl:mt-48">
      <ProductsCategoryList
        data={products.data}
        meta={products.meta}
        queryParams={{ sortBy: currentSortBy, sortOrder: currentSortOrder }}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
};

export default PageCategory;
