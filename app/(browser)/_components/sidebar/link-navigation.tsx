"use client";

import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@radix-ui/react-separator";

interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  SubCategory?: {
    name: string;
    slug: string;
  }[];
}

const LinkNavigation = ({ categories }: { categories: CategoryProps[] }) => {
  return (
    <div className="mb-5">
      <Accordion type="single" collapsible className="w-full">
        {categories.map((item, idx) => (
          <AccordionItem
            value={`item-${item.id}`}
            key={item.id}
            className="border-none"
          >
            <AccordionTrigger className="text-left">
              {item.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex ml-3">
                {/* garis vertikal */}
                <div className="w-px bg-border mr-3" />

                {/* daftar subcategory */}
                <div className="flex flex-col gap-1">
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    className="hover:bg-secondary rounded px-2 py-1 text-sm"
                  >
                    {`All ${item.name}`}
                  </Link>
                  {item.SubCategory?.map((subitem) => (
                    <Link
                      key={subitem.slug}
                      href={`/products/${item.slug}/${subitem.slug}`}
                      className="hover:bg-secondary rounded px-2 py-1 text-sm"
                    >
                      {subitem.name}
                    </Link>
                  ))}
                </div>
              </div>
            </AccordionContent>

            {idx < categories.length - 1 && (
              <Separator className="my-2 h-px bg-border" />
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default LinkNavigation;
