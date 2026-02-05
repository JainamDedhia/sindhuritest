"use client";

import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle 
} from "lucide-react";

export default function Footer() {
  // Replace with your actual WhatsApp number
  const WHATSAPP_NUMBER = "918668679249"; 
  const WHATSAPP_MESSAGE = encodeURIComponent("Hello! I need assistance with Sinduri Jewellers.");

  return (
    <footer className="relative bg-[#5c0b15] pt-16 pb-8 text-white">
      {/* DECORATIVE TOP BORDER (Optional Gold Line) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5c0b15] via-[var(--color-gold-primary)] to-[#5c0b15] opacity-50" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. BRAND SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-serif text-3xl font-medium tracking-wide">
                Sinduri Jewellers
              </h2>
              {/* Small Gold Underline */}
              <div className="mt-2 h-0.5 w-12 bg-[var(--color-gold-primary)]" />
            </div>
            
            <p className="max-w-md text-sm leading-relaxed text-gray-200/90">
              Where Heritage Meets Modern Grace. Crafting timeless pieces that celebrate your precious moments with elegance and purity.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-[var(--color-gold-primary)] hover:border-[var(--color-gold-primary)] hover:text-white hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                { name: "Collections", href: "/products" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="transition-colors hover:text-[var(--color-gold-primary)] hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. CONTACT INFO */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold-primary)]" />
                <span className="leading-relaxed">
                  Building No 85, Platinum Plaza, Thange Alley, Bhaji Market Rd, 
                  Bhiwandi, Maharashtra - 421308
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-[var(--color-gold-primary)]" />
                <a href="tel:+918600056310" className="hover:text-white transition-colors">
                  +91 86000 56310
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-[var(--color-gold-primary)]" />
                <a href="mailto:info@sindurijewellers.com" className="hover:text-white transition-colors">
                  info@sindurijewellers.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* 4. COPYRIGHT BOTTOM BAR */}
        <div className="mt-16 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Sinduri Jewellers. All rights reserved.
          </p>
        </div>
      </div>

      {/* === FLOATING WHATSAPP BUTTON === */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed bottom-6 right-6 z-50 
          flex h-14 w-14 items-center justify-center 
          rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 
          transition-transform duration-300 hover:scale-110 hover:bg-green-600
        "
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} fill="currentColor" className="text-white" />
        {/* Pulse Effect */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-500 opacity-30"></span>
      </a>

    </footer>
  );
}