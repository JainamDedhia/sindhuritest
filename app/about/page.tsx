"use client";

import { Crown, PenTool, ShieldCheck, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      
      {/* ================= 1. HERO SECTION ================= */}
      {/* A moody, full-width banner that sets the tone */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=2070&auto=format&fit=crop"
          alt="Jewelry Craftsmanship"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="font-serif text-4xl font-medium text-white md:text-6xl">
            Sinduri Jewellers
          </h1>
          <div className="mt-4 h-1 w-16 bg-[var(--color-gold-primary)]" />
          <p className="mt-6 max-w-2xl text-lg text-gray-200 md:text-xl font-light tracking-wide">
            Where heritage meets modern grace. Crafting timeless pieces that celebrate your most precious moments since 1995.
          </p>
        </div>
      </div>


      {/* ================= 2. OUR STORY (Split Layout) ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-gray-900 md:text-4xl">
              A Legacy of Purity
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Sinduri Jewellers is a legacy brand built over more than 50 years, rooted in values that have stood strong across generations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Established in 1975, Sinduri Jewellers was created with a clear purpose. To build a jewellery business based on trust, long-term relationships, and uncompromised standards. The name Sinduri was chosen thoughtfully. Sindur represents tradition, purity, and lifelong commitment. These values define the brand to this day.
            </p>
            
            {/* Signature / Quote */}
            <div className="border-l-4 border-[var(--color-gold-primary)] pl-6 pt-2 italic text-gray-700">
              "Sabse Achha. Sabse Sasta."
            </div>
          </div>

          {/* Right: Image Grid */}
          <div className="relative grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0" 
              className="h-64 w-full rounded-2xl object-cover shadow-lg translate-y-8" // Offset effect
              alt="Gold Necklaces"
            />
            <img 
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a" 
              className="h-64 w-full rounded-2xl object-cover shadow-lg"
              alt="Craftsmanship"
            />
            {/* Decorative Gold Box behind */}
            <div className="absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-xl bg-[var(--color-gold-primary)]/10" />
            <div className="absolute -left-4 -bottom-4 -z-10 h-32 w-32 rounded-xl bg-[var(--color-gold-primary)]/10" />
          </div>

        </div>
      </section>


      {/* ================= 3. OUR VALUES (Cards) ================= */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
          <h2 className="font-serif text-3xl text-gray-900 mb-12">Why Choose Sinduri?</h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                icon: Crown, 
                title: "100% Hallmark", 
                desc: "Every piece is BIS Hallmarked, ensuring you get exactly the purity you pay for." 
              },
              { 
                icon: PenTool, 
                title: "Handcrafted", 
                desc: "Designed by master artisans who have inherited skills over generations." 
              },
              { 
                icon: ShieldCheck, 
                title: "Transparent Pricing", 
                desc: "No hidden charges. We pride ourselves on honest making charges and policies." 
              },
              { 
                icon: Clock, 
                title: "Lifetime Exchange", 
                desc: "We stand by our quality. Enjoy hassle-free exchange policies on all gold items." 
              },
            ].map((feature, i) => (
              <div key={i} className="group rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-gold-primary)]/10 text-[var(--color-gold-primary)] group-hover:bg-[var(--color-gold-primary)] group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= 4. FOUNDER / CTA SECTION ================= */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-gray-900 md:text-4xl">
          Visit Our Store
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Photographs can only capture so much. Come experience the weight, the shine, and the detail of our collections in person.
        </p>
        
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/contact"
            className="rounded-full bg-gray-900 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-black"
          >
            Get Directions
          </a>
          <a
            href="/products"
            className="rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            Browse Collection
          </a>
        </div>
      </section>

    </div>
  );
}