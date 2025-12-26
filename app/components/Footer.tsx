/**
 * FOOTER COMPONENT
 * Site footer with copyright and basic info
 * Consistent styling with brand colors
 */
export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-cream)] border-t border-[var(--color-border)] py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand/Copyright */}
          <div className="text-sm text-[var(--color-text-secondary)]">
            © {new Date().getFullYear()} Jewellery Store. All rights reserved.
          </div>

          {/* Quick Links */}
          <div className="flex gap-6 text-sm">
            <a 
              href="/about" 
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-gold-primary)] transition"
            >
              About Us
            </a>
            <a 
              href="/contact" 
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-gold-primary)] transition"
            >
              Contact
            </a>
            <a 
              href="/privacy" 
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-gold-primary)] transition"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}