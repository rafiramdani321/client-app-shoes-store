import React from "react";

import Wrapper from "./wrapper";
import LinkNavigation from "./link-navigation";
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
        <LinkNavigation categories={categories.data ?? []} />
      </Wrapper>
    </>
  );
};
