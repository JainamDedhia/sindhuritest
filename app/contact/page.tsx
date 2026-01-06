"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert("Thank you! We will contact you shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* ================= 1. HEADER SECTION ================= */}
      <div className="bg-gray-50 py-16 text-center">
        <h1 className="font-serif text-3xl font-medium text-gray-900 md:text-5xl">
          Get in Touch
        </h1>
        <div className="mx-auto mt-4 h-0.5 w-16 bg-[var(--color-gold-primary)]" />
        <p className="mx-auto mt-4 max-w-lg text-sm text-gray-500 leading-relaxed">
          Whether you have a question about a bespoke piece or need assistance with your order, our dedicated team is here to assist you.
        </p>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* ================= 2. CONTACT INFO (Left) ================= */}
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl text-gray-900">Visit Our Store</h2>
              <p className="mt-2 text-sm text-gray-500">
                Experience the craftsmanship in person at our flagship boutique.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address Card */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[var(--color-gold-primary)]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Address</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed max-w-xs">
                    Building No 85, Platinum Plaza,<br />
                    Thange Alley, Bhaji Market Rd,<br />
                    Bhiwandi, Maharashtra - 421308
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[var(--color-gold-primary)]">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Phone</h3>
                  <p className="mt-1 text-sm text-gray-600">+91 86000 56310</p>
                  <p className="text-xs text-gray-400">Mon-Sat, 10am - 9pm</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[var(--color-gold-primary)]">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Email</h3>
                  <p className="mt-1 text-sm text-gray-600">info@sindurijewellers.com</p>
                </div>
              </div>
            </div>

            {/* MAP PREVIEW (Clickable) */}
            <a 
              href="https://maps.google.com/?q=Sinduri+Jewellers+Bhiwandi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative block h-48 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
            >
              {/* Placeholder Map Image - Replace with a real screenshot of your map location if desired */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-colors">
                 <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <MapPin size={16} /> View on Google Maps
                 </span>
              </div>
            </a>
          </div>

          {/* ================= 3. INQUIRY FORM (Right) ================= */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-gray-900 mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-[var(--color-gold-primary)] transition-colors placeholder:text-gray-300"
                    placeholder="John Doe"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-[var(--color-gold-primary)] transition-colors placeholder:text-gray-300"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-[var(--color-gold-primary)] transition-colors placeholder:text-gray-300"
                  placeholder="john@example.com"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-[var(--color-gold-primary)] transition-colors placeholder:text-gray-300 resize-none"
                  placeholder="I am interested in..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-gold-primary)] text-white py-4 text-sm font-medium uppercase tracking-widest hover:bg-[var(--color-gold-accent)] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Send Inquiry"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}