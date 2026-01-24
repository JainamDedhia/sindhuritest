"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import AuthSessionProvider from "./components/SessionProvider";
import { usePathname } from "next/navigation";
import { useCartSync} from "./hooks/useCartSync";
import {ErrorBoundary} from "./components/ErrorBoundary";

/**
 * ROOT LAYOUT
 * Shows Navbar + Footer for regular pages
 * Hides them for admin routes (admin has its own layout)
 */

function CartSyncProvider({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}

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
      <ErrorBoundary>
        <AuthSessionProvider>
            <CartSyncProvider>
          {/* Only show Navbar + Footer for NON-admin routes */}
          {!isAdminRoute && <Navbar />}

          <main className={!isAdminRoute ? "min-h-screen" : ""}>
            {children}
          </main>

          {!isAdminRoute && <Footer />}

          {/* Global Toast Notification */}
          <Toast />
          </CartSyncProvider>
        </AuthSessionProvider>
        </ErrorBoundary>
        
      </body>
    </html>
  );
}