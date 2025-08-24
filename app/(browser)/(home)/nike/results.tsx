"use client";

import React from "react";
import Link from "next/link";

import CarouselProduct from "../_components/carousel-product";

const ResultsProductNike = () => {
  const products = Array.from({ length: 15 });
  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <h2 className="font-bold text-lg md:text-xl italic uppercase">
            Nike
          </h2>
          <span className="absolute text-5xl md:text-6xl text-primary/40 uppercase font-extrabold italic -top-2 left-3 opacity-30 select-none pointer-events-none">
            Nike
          </span>
        </div>
        <Link
          href="/new-arrivals"
          className="text-muted-foreground hover:underline text-sm md:text-base"
        >
          See all
        </Link>
      </div>

      <CarouselProduct products={products} />
    </section>
  );
};

export default ResultsProductNike;
