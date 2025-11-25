"use client";

import React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface CategoryProps {
  data: {
    name: string;
    slug: string;
    SubCategory?: {
      name: string;
      slug: string;
    }[];
  }[];
}

const NavLink = ({ categories }: { categories: CategoryProps }) => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {categories.data.map((item, i) => (
          <NavigationMenuItem key={i}>
            {item.SubCategory && item.SubCategory.length > 0 ? (
              <>
                <NavigationMenuTrigger className="text-[14px] tracking-wide font-medium capitalize">
                  {item.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href={`/products/${item.slug}`}>
                          All {item.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {item.SubCategory.map((subitem, j) => (
                      <li key={j}>
                        <NavigationMenuLink asChild>
                          <Link href={`/products/${item.slug}/${subitem.slug}`}>
                            {subitem.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={`/products/${item.slug}`}
                  className="text-[14px] tracking-wide font-medium capitalize px-3 py-2"
                >
                  {item.name}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLink;
