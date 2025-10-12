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
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <NavHeader />
        <PageNavigationMenu />
        <CartSidebar />
        <main className="flex-1">{children}</main>
        <footer className="w-full bg-background border-t mt-32 px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64">
          <Footer />
        </footer>
      </div>
    </>
  );
}
