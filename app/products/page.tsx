import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Puja Kits | Puja Kit Store Hyderabad",
    description:
        "Explore our collection of authentic ready-made puja kits. Choose the perfect puja kit for your spiritual rituals, festivals, and daily worship.",
};

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-amber-50/30 pb-20">
            {/* ═══════════════════════════════════════════════════════════
          PAGE HEADER
      ═══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 text-white py-16 lg:py-24">
                {/* Decorative elements */}
                <div className="absolute inset-0 mandala-bg opacity-10" />
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-black/10 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
                        🕉️ Our Collection
                    </span>
                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Puja Kits
                    </h1>
                    <p className="text-orange-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        Choose the perfect puja kit for your spiritual rituals. Crafted with
                        purity and devotion for every sacred occasion.
                    </p>
                </div>

                {/* Wave bottom */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-8 fill-amber-50/30">
                        <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" />
                    </svg>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
          PRODUCTS GRID
      ═══════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Categories / Filter Bar (Visual only for now) */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {["All Kits", "Festival", "Vrat Puja", "Ceremony", "Daily"].map((cat) => (
                        <button
                            key={cat}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all border ${cat === "All Kits"
                                    ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-200"
                                    : "bg-white border-orange-200 text-orange-800 hover:border-orange-400 hover:bg-orange-50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* The Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, i) => (
                        <div
                            key={product.id}
                            className="animate-fadeInUp"
                            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Empty state or info box */}
                <div className="mt-20 bg-white rounded-3xl border border-orange-100 p-8 lg:p-12 text-center shadow-sm max-w-4xl mx-auto">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-2xl font-bold text-orange-900 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                        Can&apos;t find a specific kit?
                    </h3>
                    <p className="text-orange-700/70 mb-8 max-w-lg mx-auto">
                        We specialize in creating custom puja kits tailored to your specific ritual needs.
                        Talk to us on WhatsApp and we&apos;ll assemble one just for you.
                    </p>
                    <a
                        href="https://wa.me/919876543210?text=Hello! I'm looking for a specific puja kit that isn't listed on your website."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg hover:shadow-green-200"
                    >
                        <span className="text-xl">💬</span>
                        Chat with us for Custom Kits
                    </a>
                </div>
            </section>
        </div>
    );
}
