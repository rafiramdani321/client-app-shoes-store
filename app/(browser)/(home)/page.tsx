import React from "react";
import ProductNewArivals from "./new-arivals/page";
import { ThemeToggle } from "@/components/themeToggle";
import ProductNike from "./nike/page";
import ProductAdidas from "./adidas/page";
import CategoriesGender from "./categories-gender/page";
import Blog from "./blog/page";

const HomePage = () => {
  return (
    <div>
      <ProductNewArivals />
      <ProductNike />
      <ProductAdidas />
      <CategoriesGender />
      <Blog />
      <div className="mt-40">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default HomePage;
