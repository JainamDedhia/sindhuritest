"use client";

import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AuthSessionProvider from "./components/SessionProvider"
import { usePathname } from "next/navigation"

/**
 * ROOT LAYOUT
 * Shows Navbar + Footer for regular pages
 * Hides them for admin routes (admin has its own layout)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're in admin section
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-white text-black">
        <AuthSessionProvider>
          {/* Only show Navbar + Footer for NON-admin routes */}
          {!isAdminRoute && <Navbar />}
          
          <main className={!isAdminRoute ? "min-h-screen" : ""}>
            {children}
          </main>
          
          {!isAdminRoute && <Footer />}
        </AuthSessionProvider>
      </body>
    </html>
  );
}