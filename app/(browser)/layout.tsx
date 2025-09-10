import React from "react";

import Navbar from "./_components/navbar";
import Container from "./_components/container";
import { CarouselPage } from "./_components/caraousel";
import { PageNavigationMenu } from "./_components/sidebar";
import NavHeader from "./_components/navigation-header";
import Footer from "./_components/footer";

export default async function BrowserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <NavHeader />
      <PageNavigationMenu />
      <div className="flex justify-center mt-[5rem] lg:mt-[9rem] px-4 xl:px-10">
        <CarouselPage />
      </div>
      <div className="h-full px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64 mt-10 lg:mt-20 mb-56">
        <Container>{children}</Container>
      </div>
      <div className="w-full pt-5 h-44 bg-background border-t bottom-0 px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64">
        <Footer />
      </div>
    </>
  );
}
