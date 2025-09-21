import React from "react";

import Navbar from "./_components/navbar";
import { PageNavigationMenu } from "./_components/sidebar";
import NavHeader from "./_components/navigation-header";
import Footer from "./_components/footer";
import CartSidebar from "./_components/carts";

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
      <CartSidebar />
      {children}
      <div className="w-full mt-20 pt-5 h-44 bg-background border-t bottom-0 px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64">
        <Footer />
      </div>
    </>
  );
}
