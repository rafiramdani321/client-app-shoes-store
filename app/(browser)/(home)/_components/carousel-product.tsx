"use client";

import React from "react";

import ProductCard from "../_components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductListType } from "@/types/product.type";

const CarouselProduct = ({ products }: { products: ProductListType[] }) => {
  const [slidesPerView, setSlidesPerView] = React.useState(2);
  const [emblaApi, setEmblaApi] = React.useState<any>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  // Hitung jumlah slide per view sesuai ukuran layar
  React.useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(5);
      else if (window.innerWidth >= 768) setSlidesPerView(4);
      else if (window.innerWidth >= 640) setSlidesPerView(3);
      else setSlidesPerView(2);
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  // Cek status button saat carousel berpindah
  React.useEffect(() => {
    if (!emblaApi) return;

    const updateButtons = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };

    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi]);

  const scrollNextGroup = () => {
    if (!emblaApi) return;
    const nextIndex = emblaApi.selectedScrollSnap() + slidesPerView;
    emblaApi.scrollTo(nextIndex);
  };

  const scrollPrevGroup = () => {
    if (!emblaApi) return;
    const prevIndex = emblaApi.selectedScrollSnap() - slidesPerView;
    emblaApi.scrollTo(prevIndex);
  };
  return (
    <Carousel
      opts={{
        align: "start",
        dragFree: true,
      }}
      setApi={setEmblaApi}
      className="w-full px-2"
    >
      <CarouselContent>
        {products.map((product, index) => (
          <CarouselItem
            key={index}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Tombol Prev */}
      <button
        onClick={scrollPrevGroup}
        disabled={!canPrev}
        className={`absolute -left-2 top-1/2 -translate-y-1/2 rounded-full p-1 z-10 border 
            ${
              canPrev
                ? "bg-background hover:bg-muted text-primary"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
      >
        <ChevronLeft />
      </button>

      {/* Tombol Next */}
      <button
        onClick={scrollNextGroup}
        disabled={!canNext}
        className={`absolute -right-2 top-1/2 -translate-y-1/2 rounded-full p-1 z-10 border
            ${
              canNext
                ? "bg-background hover:bg-muted text-primary"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
      >
        <ChevronRight />
      </button>
    </Carousel>
  );
};

export default CarouselProduct;
