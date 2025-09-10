import React from "react";

import Wrapper from "./wrapper";
import Toggle from "./toggle";
import LinkNavigation from "./link-navigation";
import FooterSidebar from "./footer";
import CategoriesSerive from "@/services/categories";

export const PageNavigationMenu = async () => {
  const categories = await CategoriesSerive.getCategories({
    limit: 10,
    sortBy: "created_at",
    sortOrder: "asc",
  });
  return (
    <>
      <Wrapper>
        <Toggle />
        <LinkNavigation categories={categories} />
        <FooterSidebar />
      </Wrapper>
    </>
  );
};
