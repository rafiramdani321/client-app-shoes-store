import ProductsService from "@/services/products";
import { notFound } from "next/navigation";
import React from "react";
import ProductDetail from ".";

const PageProductDetail = async ({ params }: { params: { slug: string } }) => {
  const product: any = await ProductsService.getProductBySlug(params.slug);
  if (!product.success && product.status === 404) {
    notFound();
  }

  return (
    <div className="mt-44">
      <ProductDetail product={product.data} />
    </div>
  );
};

export default PageProductDetail;
