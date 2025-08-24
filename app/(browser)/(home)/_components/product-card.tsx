import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = (data: { i: number }) => {
  return (
    <Link href={`/product/sample`} className="block">
      <div className="bg-background dark:bg-primary-foreground rounded-md">
        {/* Product Image */}
        <div className="bg-neutral-200/30 dark:bg-black/30 flex items-center justify-center rounded-md rounded-b-none overflow-hidden">
          <Image
            src={"/images/2.png"}
            alt="Nike Air Jordan High Red Unisex"
            width={500}
            height={500}
            className="object-contain max-h-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1 px-2 pb-2.5">
          <p className="text-sm md:text-base font-semibold leading-snug line-clamp-2 hover:underline">
            Nike Air Jordan High Red
          </p>
          <p className="text-xs md:text-sm text-gray-500">Unisex Shoes</p>

          <div className="flex items-center justify-between mt-1">
            <p className="text-sm md:text-base font-semibold text-primary">
              ${data.i}
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
