import ProductsService from "@/services/products";
import { notFound } from "next/navigation";
import React from "react";
import ProductDetail from "./product-detail";

const PageProductDetail = async ({ params }: { params: { slug: string } }) => {
  await new Promise((res) => setTimeout(res, 5000));

  const product: any = await ProductsService.getProductBySlug(params.slug);
  if (!product.success && product.status === 404) {
    notFound();
  }

  return (
    <div className="mt-24 md:mt-28 lg:mt-44">
      <ProductDetail product={product.data} />
    </div>
  );
};

export default PageProductDetail;
