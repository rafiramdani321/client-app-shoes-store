"use client";

import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import React from "react";

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

const LinkNavigation = ({ categories }: { categories: CategoryProps }) => {
  return (
    <div>
      <h1>Categories</h1>
    </div>
  );
};

export default LinkNavigation;
