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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";

interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  SubCategory?: {
    name: string;
    slug: string;
  }[];
}

const dataMyAccount = [
  {
    id: 1,
    href: "/admin/dashboard",
    title: "Admin dashboard",
  },
  {
    id: 2,
    href: "/profile",
    title: "Profile",
  },
  {
    id: 3,
    title: "mode",
  },
  {
    id: 4,
    title: "logout",
  },
];

const LinkNavigation = ({ categories }: { categories: CategoryProps[] }) => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const IconMode = theme === "light" ? Sun : Moon;
  return (
    <div className="mb-20">
      <div className="mt-3 mb-4">
        <h1 className="uppercase font-semibold text-muted-foreground text-sm mb-1">
          Categories
        </h1>
        <Accordion type="single" collapsible className="w-full pl-3">
          {categories.map((item, idx) => (
            <AccordionItem
              value={`item-${item.id}`}
              key={item.id}
              className="border-none space-y-0"
            >
              <AccordionTrigger className="text-left capitalize text-xs">
                {item.name}
              </AccordionTrigger>
              <AccordionContent className="text-xs">
                <div className="flex ml-3">
                  {/* garis vertikal */}
                  <div className="w-px bg-border mr-2" />

                  {/* daftar subcategory */}
                  <div className="flex flex-col gap-1">
                    <Link
                      key={item.slug}
                      href={`/products/${item.slug}`}
                      className="hover:bg-secondary rounded px-2 py-1"
                    >
                      {`All ${item.name}`}
                    </Link>
                    {item.SubCategory?.map((subitem) => (
                      <Link
                        key={subitem.slug}
                        href={`/products/${item.slug}/${subitem.slug}`}
                        className="hover:bg-secondary rounded px-2 py-1 capitalize"
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
      <div className="mt-3 mb-4">
        <h1 className="uppercase font-semibold text-muted-foreground text-sm mb-3">
          My Account
        </h1>
        <Accordion type="single" collapsible className="w-full pl-3">
          {dataMyAccount.map((item, i) => (
            <AccordionItem
              value={`myaccount-${i}`}
              key={item.id}
              className="border-none"
            >
              {item.href ? (
                <Link href={item.href} className="text-left capitalize text-xs">
                  {item.title}
                </Link>
              ) : item.title === "mode" ? (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="mode"
                    checked={theme === "light" ? false : true}
                    onCheckedChange={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                  />
                  <IconMode className="w-4 h-4" />
                </div>
              ) : item.title === "logout" ? (
                <button className="text-left capitalize text-xs">Logout</button>
              ) : null}
              {i < dataMyAccount.length - 1 && (
                <Separator className="my-2 h-px bg-border" />
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default LinkNavigation;
