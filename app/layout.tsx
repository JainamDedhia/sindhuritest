import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
<<<<<<< Updated upstream
import AuthSessionProvider from "./components/SessionProvider"
=======
>>>>>>> Stashed changes

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
<<<<<<< Updated upstream
        <AuthSessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthSessionProvider>
=======
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
>>>>>>> Stashed changes
      </body>
    </html>
  )
}
