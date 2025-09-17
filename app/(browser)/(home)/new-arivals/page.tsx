import React from "react";
import ResultsNewArivals from "./results";
import ProductsService from "@/services/products";

const ProductNewArivals = async () => {
  const responses = await ProductsService.getProducts({
    limit: 15,
    sortBy: "updated_at",
    sortOrder: "desc",
  });
  const products = responses.data;
  return <ResultsNewArivals products={products} />;
};

export default ProductNewArivals;
