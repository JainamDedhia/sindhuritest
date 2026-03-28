"use client";

import { Crown, PenTool, ShieldCheck, Clock, MapPin, Phone, Mail, FileText } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen selection:bg-(--color-gold-primary) selection:text-white">
      
      {/* ================= 1. HERO / TITLE ================= */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-6 text-center">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight">
          About Sinduri Jewellers
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 bg-linear-to-r from-transparent via-(--color-gold-primary) to-transparent opacity-70" />
      </section>

      {/* ================= 2. OUR STORY (Typography Focused) ================= */}
      <section className="mx-auto max-w-3xl px-6 pb-20 text-center md:text-left">
        <div className="space-y-8 text-base md:text-lg text-gray-700 leading-relaxed font-light">
          <p className="first-letter:float-left first-letter:text-6xl first-letter:font-serif first-letter:text-(--color-gold-primary) first-letter:leading-[0.2]">
            Sinduri Jewellers was built with a clear vision. To become a name people trust not just once, but over time. Today, it stands for consistency, commitment, and values that have remained unchanged.
          </p>
          
          <p>
            What truly defines Sinduri is its clarity in pricing and approach. Jewellery here is not made to feel complicated. It is presented in a way that is easy to understand and fair to buy. Concepts like <span className="font-medium text-gray-900 border-b border-(--color-gold-primary)/40 pb-0.5">5555, 6666, and 7777 per gram</span> were introduced with this same thinking. To offer well-made jewellery at prices that make sense, without compromising on quality.
          </p>

          <p>
            At Sinduri Jewellers, purity and transparency are never adjusted. Every piece goes through careful selection, with attention to finish, weight, and overall balance. It reflects a responsibility towards the trust customers place in the brand.
          </p>

          <div className="py-6 my-8 border-y border-gray-200/60 text-center">
            <span className="font-serif text-2xl text-(--color-gold-primary) italic">
              "The approach remains simple. To grow steadily, to serve more people, and to stay true to what the brand stands for."
            </span>
          </div>

          <p className="text-center font-medium text-gray-900">
            Sinduri Jewellers goes beyond jewellery. It carries a sense of trust that continues.
          </p>
        </div>
      </section>

      {/* ================= 3. OUR VALUES (Text Cards) ================= */}
      <section className="bg-white py-20 border-y border-gray-100">
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
            ].map((feature, i) => (
              <div key={i} className="group rounded-xl bg-[#FDFBF7] p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 border border-gray-100">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-gold-primary)/10 text-(--color-gold-primary) group-hover:bg-(--color-gold-primary) group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. OUR STORES ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl text-gray-900 md:text-4xl">Our Stores</h2>
          <p className="mt-4 text-gray-600">Visit us to experience our collections in person.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Store 1: Bazar Peth */}
          <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm border border-gray-200 hover:border-(--color-gold-primary)/50 transition-colors">
            <h3 className="font-serif text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-(--color-gold-primary)" size={24} />
              Parnaka, Bhiwandi
            </h3>
            
            <div className="space-y-4 text-sm text-gray-600 flex-1">
              <p className="leading-relaxed">
                <strong className="text-gray-900">Bazar Peth Branch:</strong><br />
                Shop No. 9, Laxmi Narayan Shopping Centre, Parnaka Road, Bazar Peth, Bhiwandi, Maharashtra 421302.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <Phone size={16} className="text-gray-400" />
                <a href="tel:+919067454309" className="hover:text-(--color-gold-primary) transition-colors">+91 90674 54309</a>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-gray-400" />
                <span>GSTIN: 27AAQPJ9586Q1ZC</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <a href="mailto:sindurijewellers272@gmail.com" className="hover:text-(--color-gold-primary) transition-colors break-all">sindurijewellers272@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Store 2: Bhaji Market */}
          <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm border border-gray-200 hover:border-(--color-gold-primary)/50 transition-colors">
            <h3 className="font-serif text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-(--color-gold-primary)" size={24} />
              Bhaji Market, Bhiwandi
            </h3>
            
            <div className="space-y-4 text-sm text-gray-600 flex-1">
              <p className="leading-relaxed">
                <strong className="text-gray-900">Bhaji Market Branch:</strong><br />
                Gala No. 2 & 3, Building No. 85, Platinum Plaza, Thange Alley, Bhaji Market Road, Bhiwandi, Maharashtra 421308.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <Phone size={16} className="text-gray-400" />
                <a href="tel:+917385855553" className="hover:text-(--color-gold-primary) transition-colors">+91 73858 55553</a>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-gray-400" />
                <span>GSTIN: 27AAQPJ9586Q1ZC</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <a href="mailto:sindurijewellers272@gmail.com" className="hover:text-(--color-gold-primary) transition-colors break-all">sindurijewellers272@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Store 3: Zaveri Bazaar */}
          <div className="flex flex-col rounded-2xl bg-gray-900 p-8 shadow-sm border border-gray-800 text-gray-300">
            <h3 className="font-serif text-xl font-medium text-white mb-6 flex items-center gap-2">
              <MapPin className="text-(--color-gold-primary)" size={24} />
              Zaveri Bazaar, Mumbai
            </h3>
            
            <div className="space-y-4 text-sm flex-1">
              <p className="leading-relaxed">
                <strong className="text-white">Backend & Wholesale Office:</strong><br />
                Maitri Bhawan, Agiary 3rd Lane, Khara Kuva, Mandvi, Zaveri Bazaar, Mumbai, Maharashtra 400003.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <Phone size={16} className="text-(--color-gold-primary)" />
                <a href="tel:+919860557666" className="hover:text-white transition-colors">+91 98605 57666</a>
              </div>
              
              <div className="flex items-center gap-3 mt-auto">
                <Mail size={16} className="text-(--color-gold-primary)" />
                <a href="mailto:sindurijewellers272@gmail.com" className="hover:text-white transition-colors break-all">sindurijewellers272@gmail.com</a>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}