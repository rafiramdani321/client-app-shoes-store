"use client";

import { cn } from "@/lib/utils";
import { ProductListType } from "@/types/product.type";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ProductCardProps = {
  product: ProductListType;
  className?: {
    sizeTitle?: string;
    sizeCategory?: string;
    price?: string;
  };
};

const ProductCard = ({ product, className }: ProductCardProps) => {
  if (!product) return null;
  return (
    <Link href={`/product/${product.slug}`} className="block">
      <div
        className={cn(
          "bg-background dark:bg-primary-foreground rounded-md w-full"
        )}
      >
        <div className="bg-neutral-200/30 dark:bg-black/30 flex items-center justify-center rounded-md rounded-b-none overflow-hidden aspect-[1/1]">
          <Image
            src={product.ProductImage[0].url}
            alt={product.title}
            width={500}
            height={500}
            className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1 px-2 pb-2.5">
          <p
            className={cn(
              "font-semibold leading-snug line-clamp-2 hover:underline",
              className?.sizeTitle
                ? className.sizeTitle
                : "text-sm md:text-base"
            )}
          >
            {product.title}
          </p>
          <p className="text-xs md:text-sm text-gray-500 truncate">
            {product.category.name}
          </p>

          <div className="flex items-center justify-between mt-1">
            <p className="text-sm md:text-base font-semibold text-primary">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(Number(product.price))}
            </p>
            <button
              type="button"
              className="p-1 rounded-full hover:bg-red-50 transition-colors"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
