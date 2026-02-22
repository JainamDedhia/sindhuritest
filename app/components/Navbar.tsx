<<<<<<< Updated upstream
import AuthButton from "./AuthButton"

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-gray-200 border-b border-gray-300 flex items-center px-6">
      {/* Logo placeholder */}
      <div className="w-32 h-6 bg-gray-400 rounded"></div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-16 h-4 bg-gray-300 rounded"></div>

        {/* 🔑 AUTH BUTTON (REAL) */}
        <AuthButton />
=======
export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-gray-200 border-b border-gray-300 flex items-center px-6">
      <div className="w-32 h-6 bg-gray-400 rounded"></div>

<<<<<<< Updated upstream
      <div className="ml-auto flex gap-4">
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
>>>>>>> Stashed changes
=======
        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-3 md:gap-6">
            
            {/* DESKTOP SEARCH BAR */}
            

            <div className="flex items-center gap-4 md:border-l md:border-gray-200 md:pl-6 h-6">
                
                {/* 🔥 WISHLIST - ONLY SHOW BADGE WHEN AUTHENTICATED */}
                <Link href="/wishlist" className="relative group text-gray-500 hover:text-black transition-colors hidden md:block">
                  <Heart size={20} className="group-hover:scale-105 transition-transform" />
                  {mounted && isAuthenticated && wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* 🔥 CART - ONLY SHOW BADGE WHEN AUTHENTICATED */}
                <Link href="/cart" className="relative group text-gray-500 hover:text-black transition-colors">
                  <ShoppingBag size={20} className="group-hover:scale-105 transition-transform" />
                  {mounted && isAuthenticated && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-[var(--color-gold-primary)] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* PROFILE DROPDOWN */}
                <div className="relative hidden md:block">
                  {session ? (
                    <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
                      <img 
                        src={session.user?.image || "https://ui-avatars.com/api/?background=random&name=" + session.user?.name} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full border border-gray-200 hover:border-[var(--color-gold-primary)] transition-colors object-cover"
                      />
                    </button>
                  ) : (
                    <Link href="/auth/login" className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white hover:bg-[var(--color-gold-primary)] transition-colors">
                       <User size={16} />
                    </Link>
                  )}

                  <AnimatePresence>
                    {showProfileMenu && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden"
                        >
                          <div className="p-1">
                            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setShowProfileMenu(false)}>
                              <User size={15} /> Profile
                            </Link>
                            <Link href="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setShowProfileMenu(false)}>
                              <ShoppingBag size={15} /> Orders
                            </Link>
                            <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg text-left">
                              <LogOut size={15} /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
            </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`
          absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden
          transition-all duration-300 ease-in-out origin-top z-40
          ${isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-5 invisible pointer-events-none"}
        `}
      >
        <div className="flex flex-col p-4 space-y-4 font-medium text-gray-900">
          
          
          

          <Link
            href="/products"
            className="flex items-center gap-3 py-2 hover:text-[var(--color-gold-primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingBag size={18} /> Shop Collection
          </Link>
          
          {/* 🔥 MOBILE WISHLIST - ONLY SHOW COUNT WHEN AUTHENTICATED */}
          <Link
            href="/wishlist"
            className="flex items-center justify-between py-2 hover:text-[var(--color-gold-primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <Heart size={18} /> My Wishlist
            </span>
            {mounted && isAuthenticated && wishlistCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 🔥 MOBILE CART - ONLY SHOW COUNT WHEN AUTHENTICATED */}
          <Link
            href="/cart"
            className="flex items-center justify-between py-2 hover:text-[var(--color-gold-primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag size={18} /> My Cart
            </span>
            {mounted && isAuthenticated && cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold-primary)] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-3 py-2 border-t border-gray-100 pt-4 hover:text-[var(--color-gold-primary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} /> My Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <Link
                href="/auth/login"
                className="flex items-center gap-3 py-2 border-t border-gray-100 pt-4 hover:text-[var(--color-gold-primary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} /> Login / Register
            </Link>
          )}
        </div>
>>>>>>> Stashed changes
      </div>
    </nav>
  )
}
