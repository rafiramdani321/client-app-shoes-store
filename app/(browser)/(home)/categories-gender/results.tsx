import Image from "next/image";
import React from "react";

const ResultsCategoryGender = () => {
  const categories = [
    { label: "Men", img: "/images/man1.jpg" },
    { label: "Women", img: "/images/women1.jpg" },
    { label: "Kids", img: "/images/kids1.jpg" },
  ];
  return (
    <section className="w-full">
      <div className="text-center">
        <h2 className="font-semibold tracking-wide text-2xl">
          Explore by Category
        </h2>
        <p className="text-sm text-muted-foreground">
          Find shoes for men, women, and kids.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="relative dark:bg-primary-foreground overflow-hidden rounded-lg group cursor-pointer"
          >
            <div className="relative w-full h-[350px]">
              <Image
                alt={cat.label}
                src={cat.img}
                fill
                className="object-contain"
              />
            </div>
            {/* Overlay text */}
            <div className="absolute inset-0 bg-black/30 flex items-end justify-center p-4">
              <span className="text-white text-xl font-semibold">
                {cat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResultsCategoryGender;
