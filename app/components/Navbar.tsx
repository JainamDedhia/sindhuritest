import Link from "next/link"
import AuthButton from "./AuthButton" // 🔑 Import auth button


/**
 * NAVBAR COMPONENT
 * Main navigation bar with logo, links, and authentication button
 * Responsive design with mobile menu coming in future iterations
 */
export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-white border-b border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
      <div className="container h-full flex items-center justify-between">
        
        {/* LEFT: Logo/Brand */}
        <Link href="/" className="flex items-center">
          <img src="/assets/Sinduri_Logo.PNG" width={100} height={20} className="mt-4 " />
        </Link>

        {/* RIGHT: Navigation + Auth */}
        <div className="flex items-center gap-6">
          {/* Main navigation links */}
          <Link 
            href="/products" 
            className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--color-gold-primary)] transition"
          >
            Products
          </Link>
          
          <Link 
            href="/wishlist" 
            className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--color-gold-primary)] transition"
          >
            Wishlist
          </Link>
          
          <Link 
            href="/cart" 
            className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--color-gold-primary)] transition"
          >
            Cart
          </Link>

          {/* 🔑 Authentication Button - handles sign in/out */}
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}