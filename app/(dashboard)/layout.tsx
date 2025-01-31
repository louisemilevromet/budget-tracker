import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Toaster } from "@/components/ui/toaster";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="max-w-[1082px] mx-auto px-8">{children}</div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default Layout;
