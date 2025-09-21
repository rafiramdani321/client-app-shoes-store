import React from "react";
import ProductNewArivals from "./new-arivals/page";
import ProductNike from "./nike/page";
import ProductAdidas from "./adidas/page";
import CategoriesGender from "./categories-gender/page";
import Blog from "./blog/page";
import { CarouselPage } from "../_components/caraousel";
import Container from "../_components/container";

const HomePage = () => {
  return (
    <div>
      <div className="flex justify-center mt-[5rem] lg:mt-[9rem] px-4 xl:px-10">
        <CarouselPage />
      </div>
      <div className="h-full px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64 mt-10 lg:mt-20 mb-56">
        <Container>
          <ProductNewArivals />
          <ProductNike />
          <ProductAdidas />
          <CategoriesGender />
          <Blog />
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
