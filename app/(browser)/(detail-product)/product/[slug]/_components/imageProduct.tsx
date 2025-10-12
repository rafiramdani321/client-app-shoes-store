import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ProductImageProps = {
  image: string;
  images: {
    id: string;
    url: string;
  }[];
  setImage: (url: string) => void;
};

const ImagesProduct = ({ image, images, setImage }: ProductImageProps) => {
  return (
    <div>
      {/* Main Image */}
      <div className="bg-neutral-200/30 dark:bg-black/30 flex items-center justify-center rounded-md overflow-hidden aspect-square group relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={image}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={image}
              alt={image}
              width={500}
              height={500}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setImage(img.url)}
            className={cn(
              "bg-neutral-200/30 dark:bg-black/30 flex items-center justify-center rounded-md overflow-hidden aspect-square w-16 cursor-pointer border transition group relative",
              img.url === image
                ? "border-blue-500 ring-2 ring-blue-400"
                : "border-transparent hover:border-blue-300"
            )}
          >
            <Image
              src={img.url}
              alt={img.url}
              width={100}
              height={100}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImagesProduct;
