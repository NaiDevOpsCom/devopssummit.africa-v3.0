import React, { Suspense } from "react";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/ui/Loading";
import PageTransition from "@/components/layout/PageTransition";

export default function RootLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {/* AnimatePresence handles unmounting animations */}
        <AnimatePresence mode="wait">
          {/* We wrap the Outlet in our PageTransition, keyed by pathname to trigger animations */}
          <PageTransition key={location.pathname}>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      {/* ScrollRestoration natively handles scroll state for react-router-dom */}
      <ScrollRestoration />
    </div>
  );
}
