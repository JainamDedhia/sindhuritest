import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AuthSessionProvider from "./components/SessionProvider" // 🔑 Keep auth provider

/**
 * ROOT LAYOUT
 * Wraps entire app with auth session provider, navbar, and footer
 * This ensures authentication state is available throughout the app
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        {/* 🔑 Auth Provider - wraps everything to provide session context */}
        <AuthSessionProvider>
          {/* Navigation bar with auth buttons */}
          <Navbar />
          
          {/* Main content area - all pages render here */}
          <main className="min-h-screen">{children}</main>
          
          {/* Footer */}
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  )
}