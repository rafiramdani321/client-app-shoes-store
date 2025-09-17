import React from "react";
import Navbar from "../(browser)/_components/navbar";
import NavHeader from "../(browser)/_components/navigation-header";
import { PageNavigationMenu } from "../(browser)/_components/sidebar";
import Container from "../(browser)/_components/container";
import Footer from "../(browser)/_components/footer";

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <NavHeader />
      <PageNavigationMenu />
      <div className="h-full mt-28 lg:mt-48 mb-56">
        <Container>{children}</Container>
      </div>
      <div className="w-full hidden lg:block pt-5 h-44 bg-background border-t bottom-0 px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64">
        <Footer />
      </div>
    </>
  );
}
