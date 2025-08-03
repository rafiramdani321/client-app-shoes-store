import React from "react";
import Navbar from "./_components/navbar";
import Container from "./_components/container";
import { CarouselPage } from "./_components/caraousel";

export default function BrowserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-[5rem] px-2">
        <CarouselPage />
      </div>
      <div className="flex h-full mt-28 px-2">
        <Container>{children}</Container>
      </div>
    </>
  );
}
