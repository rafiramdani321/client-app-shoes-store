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

const data = [
  {
    name: "Nike",
    href: "/nike",
    subCategories: [
      {
        name: "Sub Categories 1",
        href: "/#",
      },
      {
        name: "Sub Categories 2",
        href: "/#",
      },
      {
        name: "Sub Categories 3",
        href: "/#",
      },
    ],
  },
  {
    name: "Adidas",
    href: "/adidas",
    subCategories: [
      {
        name: "Sub Categories 1",
        href: "/#",
      },
      {
        name: "Sub Categories 2",
        href: "/#",
      },
      {
        name: "Sub Categories 3",
        href: "/#",
      },
    ],
  },
  {
    name: "Vans",
    href: "/vans",
    subCategories: [
      {
        name: "Sub Categories 1",
        href: "/#",
      },
      {
        name: "Sub Categories 2",
        href: "/#",
      },
      {
        name: "Sub Categories 3",
        href: "/#",
      },
    ],
  },
  {
    name: "Converse",
    href: "/converse",
    subCategories: [
      {
        name: "Sub Categories 1",
        href: "/#",
      },
      {
        name: "Sub Categories 2",
        href: "/#",
      },
      {
        name: "Sub Categories 3",
        href: "/#",
      },
    ],
  },
  {
    name: "Pantofel",
    href: "/pantofel",
    subCategories: [
      {
        name: "Sub Categories 1",
        href: "/#",
      },
      {
        name: "Sub Categories 2",
        href: "/#",
      },
      {
        name: "Sub Categories 3",
        href: "/#",
      },
    ],
  },
  {
    name: "Men's",
    href: "/men",
    subCategories: [
      {
        name: "Sub Categories 1",
        href: "/#",
      },
      {
        name: "Sub Categories 2",
        href: "/#",
      },
      {
        name: "Sub Categories 3",
        href: "/#",
      },
    ],
  },
  {
    name: "Women's",
    href: "/women",
    subCategories: [
      {
        name: "Sub Categories 1",
        href: "/#",
      },
      {
        name: "Sub Categories 2",
        href: "/#",
      },
      {
        name: "Sub Categories 3",
        href: "/#",
      },
    ],
  },
  {
    name: "Kid's",
    href: "/kid",
    subCategories: [
      {
        name: "Sub Categories 1",
        href: "/#",
      },
      {
        name: "Sub Categories 2",
        href: "/#",
      },
      {
        name: "Sub Categories 3",
        href: "/#",
      },
    ],
  },
];

const NavLink = () => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {data.map((item, i) => (
          <NavigationMenuItem key={i}>
            <NavigationMenuTrigger className="text[16px] tracking-wide font-medium">
              {item.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                <li>
                  {item.subCategories.map((subitem, i) => (
                    <NavigationMenuLink asChild key={i}>
                      <Link href="#">{subitem.name}</Link>
                    </NavigationMenuLink>
                  ))}
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLink;
