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

const banner = [
  {
    id: 1,
    imageUrl:
      "https://i.pinimg.com/736x/6b/c0/4f/6bc04f132f7807dbf2cea2e3b2f00ad8.jpg",
  },
  {
    id: 2,
    imageUrl:
      "https://i.pinimg.com/736x/ca/53/33/ca5333e59537252adff35905018ec2f5.jpg",
  },
  {
    id: 3,
    imageUrl:
      "https://i.pinimg.com/736x/8d/37/c1/8d37c11edfa5ff5940db3b4a39be3407.jpg",
  },
  {
    id: 4,
    imageUrl:
      "https://i.pinimg.com/736x/7c/96/b4/7c96b49d7b4170e888c93d8f3688d3c7.jpg",
  },
];

export function CarouselPage() {
  return (
    <Carousel
      plugins={[Autoplay({ delay: 5000 })]}
      className="w-full max-w-[30rem] sm:max-w-[65rem] md:max-w-[70rem] lg:max-w-[75rem] xl:max-w-[85rem]"
    >
      <CarouselContent>
        {banner.map((item) => (
          <CarouselItem key={item.id} className="basis-full md:basis-1/2">
            <Card className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <CardContent className="relative p-0 aspect-video">
                <div className="relative w-full h-full">
                  <Image
                    src={item.imageUrl}
                    alt={`Banner ${item.id}`}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out hover:scale-105 hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
