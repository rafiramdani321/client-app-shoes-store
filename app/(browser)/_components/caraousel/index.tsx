"use client";

import * as React from "react";

import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CarouselPage() {
  return (
    <section className="relative dark:bg-primary-foreground/50 dark:shadow-black/50 dark:shadow-xl dark:rounded-md w-full md:w-[95%] xl:w-[80%] mx-auto py-12">
      <div className="absolute top-0 right-0 w-[900px] h-[900px] -z-[1]">
        <Image
          alt="Nike background"
          src="/images/bg.jpg"
          width={900}
          height={900}
          className="opacity-30 shadow-[0_0_100px_60px_#00000080]"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 80%)",
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 80%)",
          }}
        />
      </div>

      <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center">
        <div className="relative w-full md:w-2/5 flex items-center justify-center py-10">
          <div className="relative w-[250px] h-[250px] lg:w-[340px] lg:h-[340px]">
            <div className="absolute inset-0 bg-red-600 rounded-full shadow-xl shadow-red-800/40"></div>
            <Image
              src="/images/1.png"
              alt="sneakers"
              width={260}
              height={260}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        <div className="w-full md:w-3/5 px-6 lg:px-10 py-16 lg:py-10 text-center md:text-left">
          <h3 className="text-lg md:text-xl italic text-gray-700 dark:text-muted-foreground font-semibold mb-2 tracking-wide">
            Man's Shoe
          </h3>
          <h1 className="text-5xl lg:text-6xl font-extrabold italic leading-tight mb-4">
            Nike
          </h1>
          <p className="text-base lg:text-lg text-gray-700 dark:text-muted-foreground leading-relaxed mb-6 max-w-[500px] mx-auto md:mx-0">
            Discover the ultimate comfort and style. Nike sneakers bring
            performance and iconic design together to elevate your every step.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
            <Button
              size="lg"
              className="uppercase px-8 py-3 shadow-md hover:shadow-xl"
            >
              Shop now
            </Button>
            <div className="flex gap-4 text-gray-500">
              <ChevronLeft className="w-10 h-10 hover:text-primary transition" />
              <ChevronRight className="w-10 h-10 hover:text-primary transition" />
            </div>
          </div>
        </div>
      </div>
    </section>

    // <Carousel
    //   plugins={[Autoplay({ delay: 5000 })]}
    //   className="w-full max-w-[30rem] sm:max-w-[65rem] md:max-w-[70rem] lg:max-w-[75rem] xl:max-w-[85rem]"
    // >
    //   <CarouselContent>
    //     {banner.map((item) => (
    //       <CarouselItem key={item.id} className="basis-full md:basis-1/2">
    //         <Card className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
    //           <CardContent className="relative p-0 aspect-video">
    //             <div className="relative w-full h-full">
    //               <Image
    //                 src={item.imageUrl}
    //                 alt={`Banner ${item.id}`}
    //                 fill
    //                 className="object-cover transition-transform duration-500 ease-in-out hover:scale-105 hover:brightness-110"
    //                 sizes="(max-width: 768px) 100vw, 50vw"
    //                 priority
    //               />
    //             </div>
    //           </CardContent>
    //         </Card>
    //       </CarouselItem>
    //     ))}
    //   </CarouselContent>
    // </Carousel>
  );
}
