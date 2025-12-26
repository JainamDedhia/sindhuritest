import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AuthSessionProvider from "./components/SessionProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <AuthSessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
