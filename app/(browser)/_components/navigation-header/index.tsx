import React from "react";
import NavLink from "./nav-link";
import CategoriesSerive from "@/services/categories";

const NavHeader = async () => {
  const categories = await CategoriesSerive.getCategories({
    limit: 10,
    sortBy: "created_at",
    sortOrder: "asc",
  });
  return (
    <div className="hidden lg:flex fixed w-full top-[4rem] bg-background h-16 z-40 px-2 sm:px-6 xl:px-48 justify-center items-center">
      <NavLink categories={categories} />
    </div>
  );
};

export default NavHeader;
