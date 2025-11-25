import React from "react";

import Navbar from "../../components/navbar";
import NavHeader from "../../components/navigation-header";
import CartSidebar from "../../components/carts";
import Footer from "../../components/footer";
import { PageNavigationMenu } from "../../components/sidebar";
import AuthGuard from "./_components/authGuard";

export default function UserSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <NavHeader />
        <PageNavigationMenu />
        <CartSidebar />
        <main className="flex-1 mt-52 w-full px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64">
          {children}
        </main>
        <footer className="w-full bg-background border-t mt-32 px-2 sm:px-6 lg:px-16 xl:px-32 2xl:px-64">
          <Footer />
        </footer>
      </div>
    </AuthGuard>
  );
}
