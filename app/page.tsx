import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";
import type { ProductRecord } from "@/app/api/products/route";

async function getProducts(): Promise<Product[]> {
  try {
    // In Next.js App Router, server components should use absolute URLs.
    // NEXT_PUBLIC_BASE_URL can be set in production; in dev we default to localhost.
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 60 },
    });


    if (!res.ok) throw new Error("Failed to fetch products");
    const data: ProductRecord[] = await res.json();
    // Normalize: convert badge null → undefined to match the Product interface
    return data.map((p) => ({ ...p, badge: p.badge ?? undefined }));
  } catch (error) {
    console.error("[HomePage] Could not fetch from API, using static fallback:", error);
    // Last-resort inline fallback (should never be needed since the API has its own fallback)
    const { products } = await import("@/data/products");
    return products.map((p) => ({ ...p, slug: p.id }));
  }
}

/* ─── Static Data ──────────────────────────────────────────────── */

const features = [
  {
    icon: "📦",
    title: "All Items Included",
    desc: "Every puja kit contains all essential items required — nothing left out. Just open and begin your puja.",
    color: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
  },
  {
    icon: "🙏",
    title: "Priest Recommended",
    desc: "Our kits are curated by experienced priests based on traditional Vedic puja requirements.",
    color: "from-orange-50 to-red-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
  },
  {
    icon: "🚚",
    title: "Fast Delivery in Hyderabad",
    desc: "Quick and reliable delivery across Hyderabad and Secunderabad. Same-day for orders before noon.",
    color: "from-yellow-50 to-amber-50",
    border: "border-yellow-200",
    iconBg: "bg-yellow-100",
  },
];

const testimonials = [
  {
    name: "Priya Lakshmi",
    location: "Banjara Hills, Hyderabad",
    avatar: "👩🏽",
    review:
      "Ordered the Gruhapravesam Kit for our new house. Everything was neatly packed and delivered on time. The priests appreciated the quality of all items. Highly recommended!",
    rating: 5,
    kit: "Gruhapravesam Puja Kit",
  },
  {
    name: "Ravi Kumar",
    location: "Miyapur, Hyderabad",
    avatar: "👨🏽",
    review:
      "We've been ordering the Daily Puja Kit monthly. Excellent quality, genuine products, and wonderful customer support on WhatsApp. Makes our daily worship so convenient.",
    rating: 5,
    kit: "Daily Puja Kit",
  },
  {
    name: "Sunitha Devi",
    location: "Dilsukhnagar, Hyderabad",
    avatar: "👩🏽‍🦱",
    review:
      "Got the Satyanarayana Puja Kit for our daughter's birthday vrat. Every item was authentic and fresh. The WhatsApp guidance for the puja procedure was a wonderful bonus!",
    rating: 5,
    kit: "Satyanarayana Puja Kit",
  },
];

/* ─── Page ─────────────────────────────────────────────────────── */

export default async function HomePage() {
  const products = await getProducts();
  const whatsappUrl =
    "https://wa.me/919121299888?text=" +
    encodeURIComponent(
      "Hello! I'd like to order a Puja Kit. Please share the available options and delivery details."
    );

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 text-white">
        {/* Ambient blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-orange-800/30 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 mandala-bg opacity-20" />

        <div className="relative container py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-14">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              🕉️ Hyderabad&apos;s Most Trusted Puja Kit Store
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Ready Puja Kits
              <br />
              <span className="text-yellow-200">Delivered in</span>
              <br />
              Hyderabad
            </h1>

            <p className="text-white/85 text-lg sm:text-xl mb-9 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Complete Puja Kits for Festivals, Vrat, and Daily Worship —
              handpicked with devotion and delivered fresh to your doorstep.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-green-500/40 text-lg"
              >
                {/* WhatsApp icon */}
                <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white flex-shrink-0">
                  <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.74.7 5.37 2.04 7.69L.5 31.5l8.09-2.12A15.43 15.43 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm7.68 18.59c-.42-.21-2.5-1.23-2.88-1.37-.39-.14-.67-.21-.95.21-.28.42-1.09 1.37-1.34 1.65-.25.28-.49.32-.91.1-.42-.21-1.78-.66-3.4-2.1-1.26-1.12-2.1-2.5-2.35-2.92-.25-.42-.03-.65.19-.86.2-.19.42-.49.63-.74.21-.25.28-.42.42-.7.14-.28.07-.53-.03-.74-.1-.21-.95-2.28-1.3-3.12-.34-.82-.69-.71-.95-.72l-.81-.01c-.28 0-.74.1-1.13.53-.39.42-1.47 1.44-1.47 3.5s1.51 4.06 1.72 4.34c.21.28 2.97 4.53 7.19 6.35.99.43 1.77.69 2.37.88.99.31 1.9.27 2.62.16.8-.12 2.5-1.02 2.85-2 .35-.98.35-1.82.25-2-.1-.17-.38-.27-.8-.49z" />
                </svg>
                Order on WhatsApp
              </a>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border-2 border-white/70 text-white font-semibold px-8 py-4 rounded-full transition-all text-lg backdrop-blur-sm"
              >
                🛍️ Browse All Kits
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mt-9 text-sm text-white/80">
              {["✅ 100% Authentic", "🚚 Same-Day Delivery", "🙏 500+ Happy Families", "📞 Free Puja Guidance"].map(
                (t) => (
                  <span key={t}>{t}</span>
                )
              )}
            </div>
          </div>

          {/* Right: floating icons */}
          <div className="hidden lg:grid grid-cols-2 gap-5 flex-shrink-0">
            {[
              { emoji: "🪔", label: "Deepam", delay: "0s" },
              { emoji: "🐘", label: "Ganesha", delay: "0.4s" },
              { emoji: "🌸", label: "Flowers", delay: "0.8s" },
              { emoji: "🪷", label: "Lotus", delay: "1.2s" },
            ].map((item) => (
              <div
                key={item.label}
                className="w-32 h-32 rounded-2xl bg-white/15 backdrop-blur-sm flex flex-col items-center justify-center gap-2 border border-white/25 shadow-xl"
                style={{
                  animation: `float 3s ease-in-out ${item.delay} infinite`,
                }}
              >
                <span className="text-5xl">{item.emoji}</span>
                <span className="text-xs text-white/75 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-amber-50/30">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FESTIVAL HIGHLIGHT BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-4 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center text-white text-sm sm:text-base font-semibold px-4 text-center w-full">
            <span className="text-xl">🐘</span>
            <span className="text-sm sm:text-base">Ganesh Chaturthi Special Puja Kits</span>
            <span className="text-yellow-200 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Custom Kits for Every Ceremony</span>
            <span className="text-yellow-200 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Free WhatsApp Support</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-700 font-bold text-xs px-4 py-1.5 rounded-full hover:bg-orange-50 transition-colors flex-shrink-0"
            >
              Order Now →
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. FEATURED PUJA KITS
      ═══════════════════════════════════════════════════════════ */}
      <section className="container py-10 sm:py-12 lg:py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-orange-500 font-bold uppercase tracking-widest text-xs mb-3">
            🪔 Our Collection
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-orange-900"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Featured Puja Kits
          </h2>
          <p className="text-orange-700/70 mt-3 max-w-xl mx-auto text-base">
            From daily worship to grand ceremonies — every kit is thoughtfully
            assembled with authentic, priest-recommended items.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-fadeInUp"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationFillMode: "both",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold px-10 py-3.5 rounded-full hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-orange-300"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. WHY CHOOSE US
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-orange-100 py-10 sm:py-12 lg:py-16">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block text-orange-500 font-bold uppercase tracking-widest text-xs mb-3">
              ✨ Our Promise
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-orange-900"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Why Choose Us
            </h2>
            <p className="text-orange-700/70 mt-3 max-w-lg mx-auto">
              Thousands of families in Hyderabad trust us for their sacred
              ceremonies. Here&apos;s what makes us different.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {features.map((f) => (
              <div
                key={f.title}
                className={`relative bg-gradient-to-br ${f.color} border ${f.border} rounded-3xl p-8 hover:shadow-lg transition-shadow group overflow-hidden`}
              >
                {/* BG decoration */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/40 group-hover:scale-125 transition-transform duration-500" />

                <div
                  className={`w-14 h-14 ${f.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm`}
                >
                  {f.icon}
                </div>
                <h3
                  className="text-orange-900 font-bold text-xl mb-3"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-orange-800/70 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. CUSTOMER REVIEWS
      ═══════════════════════════════════════════════════════════ */}
      <section className="container py-10 sm:py-12 lg:py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-orange-500 font-bold uppercase tracking-widest text-xs mb-3">
            💬 Testimonials
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-orange-900"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            What Our Customers Say
          </h2>
          <p className="text-orange-700/70 mt-3 max-w-lg mx-auto">
            Real stories from families across Hyderabad who trusted us for
            their sacred occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-orange-100 rounded-3xl p-7 shadow-md hover:shadow-xl transition-shadow flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Review text */}
              <p className="text-orange-800/80 leading-relaxed text-sm flex-1 mb-6 italic">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 border-t border-orange-100 pt-5">
                <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-orange-900 font-semibold text-sm">
                    {t.name}
                  </div>
                  <div className="text-orange-500 text-xs">{t.location}</div>
                </div>
                <div className="ml-auto">
                  <span className="bg-orange-50 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full border border-orange-200">
                    {t.kit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating summary */}
        <div className="mt-10 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl py-6 px-8 flex flex-wrap items-center justify-center gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-orange-700">4.9</div>
            <div className="flex justify-center gap-0.5 my-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400">★</span>
              ))}
            </div>
            <div className="text-orange-600 text-xs font-medium">Average Rating</div>
          </div>
          <div className="w-px h-12 bg-orange-200 hidden sm:block" />
          <div>
            <div className="text-4xl font-bold text-orange-700">500+</div>
            <div className="text-orange-600 text-xs font-medium mt-1">Happy Families</div>
          </div>
          <div className="w-px h-12 bg-orange-200 hidden sm:block" />
          <div>
            <div className="text-4xl font-bold text-orange-700">100%</div>
            <div className="text-orange-600 text-xs font-medium mt-1">Authentic Items</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. FESTIVAL HIGHLIGHT BANNER (full section)
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-amber-800 to-orange-900 text-white py-10 sm:py-14 lg:py-20">
        {/* Decorative background */}
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        {/* Centered content wrapper aligned with the rest of the page */}
        <div className="container relative text-center">

          {/* Emoji row */}
          <div className="flex items-center justify-center gap-4 text-4xl sm:text-5xl mb-5">
            <span>🐘</span>
            <span className="animate-float" style={{ animationDelay: "0.3s" }}>🌼</span>
            <span>🪔</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center justify-center bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            🎉 Festival Special
          </div>

          {/* Heading */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight mx-auto max-w-2xl"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Ganesh Chaturthi Special
            <br />
            <span className="text-amber-300">Puja Kits Available</span>
          </h2>

          {/* Subtext */}
          <p className="text-orange-200 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Celebrate the beloved festival of Lord Ganesha with our specially
            curated Chaturthi kits — complete, authentic, and delivered to your
            doorstep.
          </p>

          {/* CTA buttons — centered, stack on mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-green-500/40 w-full sm:w-auto"
            >
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white flex-shrink-0">
                <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.74.7 5.37 2.04 7.69L.5 31.5l8.09-2.12A15.43 15.43 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm7.68 18.59c-.42-.21-2.5-1.23-2.88-1.37-.39-.14-.67-.21-.95.21-.28.42-1.09 1.37-1.34 1.65-.25.28-.49.32-.91.1-.42-.21-1.78-.66-3.4-2.1-1.26-1.12-2.1-2.5-2.35-2.92-.25-.42-.03-.65.19-.86.2-.19.42-.49.63-.74.21-.25.28-.42.42-.7.14-.28.07-.53-.03-.74-.1-.21-.95-2.28-1.3-3.12-.34-.82-.69-.71-.95-.72l-.81-.01c-.28 0-.74.1-1.13.53-.39.42-1.47 1.44-1.47 3.5s1.51 4.06 1.72 4.34c.21.28 2.97 4.53 7.19 6.35.99.43 1.77.69 2.37.88.99.31 1.9.27 2.62.16.8-.12 2.5-1.02 2.85-2 .35-.98.35-1.82.25-2-.1-.17-.38-.27-.8-.49z" />
              </svg>
              Order Ganesh Kit on WhatsApp
            </a>
            <Link
              href="/product/ganesh-puja-kit"
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-full transition-all w-full sm:w-auto"
            >
              🐘 View Kit Details
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-t border-orange-100 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-4xl mb-4">🙏</p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-orange-900 mb-3"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Need a Custom Puja Kit?
          </h2>
          <p className="text-orange-700/80 mb-7 max-w-md mx-auto">
            Planning a special occasion? We assemble custom kits tailored to
            your specific puja requirements — just WhatsApp us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg"
            >
              💬 Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-block bg-white border-2 border-orange-300 text-orange-700 font-bold px-8 py-3.5 rounded-full hover:bg-orange-50 transition-all"
            >
              📞 Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
