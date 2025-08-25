import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => (
  <>
    <Header />
    <main className="min-h-[80vh]">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
