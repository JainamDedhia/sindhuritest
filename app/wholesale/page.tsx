"use client";

import { MapPin, Phone, Mail, MessageCircle, TrendingUp, ShieldCheck, Gem } from "lucide-react";

export default function WholesalePage() {
  const WHOLESALE_PHONE = "919860557666";
  const whatsappMessage = encodeURIComponent("Hello Sinduri Jewellers, I would like to inquire about wholesale / bulk orders for my business.");

  return (
    <div className="bg-[#FDFBF7] min-h-screen selection:bg-[var(--color-gold-primary)] selection:text-white pb-20">
      
      {/* ================= 1. HERO SECTION (Clean & Minimal) ================= */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6">
          <Gem size={14} className="text-[var(--color-gold-primary)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">B2B Partners</span>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight mb-6">
          Sinduri Wholesale
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600 font-light leading-relaxed">
          Best selling designs, consistent quality aur clear pricing — <span className="font-medium text-gray-900">aapke business ke liye.</span>
        </p>
      </section>

      {/* ================= 2. VALUE PROPOSITION (Flat & Elegant) ================= */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 border border-gray-200 text-center flex flex-col items-center">
            <div className="mb-5 text-[var(--color-gold-primary)]">
              <TrendingUp size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-gray-900 mb-3">Fast-Moving Designs</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Aise designs jo easily sell hote hain. Crafted keeping market trends and customer demand in focus.</p>
          </div>

          <div className="bg-white p-8 border border-gray-200 text-center flex flex-col items-center">
            <div className="mb-5 text-[var(--color-gold-primary)]">
              <ShieldCheck size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-gray-900 mb-3">Consistent Quality</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Quality mein 100% consistency rehti hai. Har piece mein kaam, weight aur value ka proper balance rakha gaya hai.</p>
          </div>

          <div className="bg-white p-8 border border-gray-200 text-center flex flex-col items-center">
            <div className="mb-5 text-[var(--color-gold-primary)]">
              <MapPin size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-gray-900 mb-3">Zaveri Bazaar Hub</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Operating directly from the heart of India's jewelry market, ensuring competitive rates and clear pricing.</p>
          </div>

        </div>
      </section>

      {/* ================= 3. CONTACT CARD (Minimal Letterhead Style) ================= */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="bg-white border border-gray-200 shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Side: Info */}
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200">
              <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2">Wholesale Enquiries</h2>
              <p className="text-gray-500 text-sm mb-10">For bulk orders or detailed requirements, please connect:</p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Call Us</p>
                    <a href="tel:+919860557666" className="text-gray-900 hover:text-[var(--color-gold-primary)] transition-colors">
                      +91 98605 57666
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Email</p>
                    <a href="mailto:sindurijewellers272@gmail.com" className="text-gray-900 hover:text-[var(--color-gold-primary)] transition-colors break-all">
                      sindurijewellers272@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Office</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Maitri Bhawan, Agiary 3rd Lane,<br />
                      Khara Kuva, Mandvi,<br />
                      Zaveri Bazaar, Mumbai 400003
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Flat CTA Action */}
            <div className="p-8 md:p-12 flex flex-col justify-center items-center text-center bg-gray-50/50">
              <div className="mb-6 text-[#25D366]">
                <MessageCircle size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg text-gray-900 font-medium mb-3">Fastest way to connect</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[250px]">
                Message us on WhatsApp for an immediate response from our B2B team.
              </p>
              
              <a
                href={`https://wa.me/${WHOLESALE_PHONE}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded bg-[#25D366] text-white font-medium uppercase tracking-wider hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle size={18} />
                Message on WhatsApp
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}