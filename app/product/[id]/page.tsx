import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProductById } from "@/data/products";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) return { title: "Product Not Found" };
    return {
        title: `${product.name} | Puja Kit Store Hyderabad`,
        description: product.description,
    };
}

const emojiMap: Record<string, string> = {
    "ganesh-puja-kit": "🐘",
    "satyanarayana-puja-kit": "🪔",
    "gruhapravesam-puja-kit": "🏠",
    "daily-puja-kit": "🌸",
};

const gradientMap: Record<string, string> = {
    "ganesh-puja-kit": "from-amber-100 via-orange-50 to-yellow-100",
    "satyanarayana-puja-kit": "from-orange-100 via-amber-50 to-red-50",
    "gruhapravesam-puja-kit": "from-red-50 via-orange-50 to-amber-100",
    "daily-puja-kit": "from-yellow-50 via-amber-50 to-orange-50",
};

const accentMap: Record<string, string> = {
    "ganesh-puja-kit": "bg-amber-500",
    "satyanarayana-puja-kit": "bg-orange-600",
    "gruhapravesam-puja-kit": "bg-red-600",
    "daily-puja-kit": "bg-yellow-500",
};

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;
    const product = getProductById(id);

    if (!product) notFound();

    const emoji = emojiMap[product.id] ?? "🪔";
    const gradient = gradientMap[product.id] ?? "from-orange-50 to-amber-50";
    const accent = accentMap[product.id] ?? "bg-orange-600";

    const whatsappMsg = `Hello, I want to order ${product.name}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMsg)}`;

    const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

    return (
        <div className="min-h-screen bg-amber-50/30">

            {/* ═══════════════════════════════════════════
          BREADCRUMB
      ═══════════════════════════════════════════ */}
            <div className="bg-white border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-sm flex-wrap">
                    <Link href="/" className="text-orange-500 hover:text-orange-700 transition-colors font-medium">
                        Home
                    </Link>
                    <span className="text-orange-300">›</span>
                    <Link href="/products" className="text-orange-500 hover:text-orange-700 transition-colors font-medium">
                        Products
                    </Link>
                    <span className="text-orange-300">›</span>
                    <span className="text-orange-900 font-semibold truncate max-w-xs">{product.name}</span>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14">

                    {/* ── LEFT: Large Product Image ── */}
                    <div className="flex flex-col gap-4">
                        <div
                            className={`relative rounded-3xl bg-gradient-to-br ${gradient} overflow-hidden shadow-lg`}
                            style={{ minHeight: "420px" }}
                        >
                            {/* Mandala background */}
                            <div className="absolute inset-0 mandala-bg opacity-25" />

                            {/* Decorative circles */}
                            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/30 blur-2xl" />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-orange-300/20 blur-2xl" />

                            {/* Main emoji */}
                            <div className="relative z-10 flex items-center justify-center h-full py-16">
                                <span
                                    className="text-[140px] leading-none select-none drop-shadow-xl"
                                    style={{ animation: "float 3s ease-in-out infinite" }}
                                >
                                    {emoji}
                                </span>
                            </div>

                            {/* Badge */}
                            {product.badge && (
                                <div className={`absolute top-5 right-5 ${accent} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-20`}>
                                    ⭐ {product.badge}
                                </div>
                            )}

                            {/* Category pill */}
                            <div className="absolute bottom-5 left-5 bg-white/80 backdrop-blur-sm text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-20">
                                🏷️ {product.category}
                            </div>
                        </div>

                        {/* Thumbnail strip (decorative accents) */}
                        <div className="grid grid-cols-4 gap-3">
                            {["🪔", "📿", "🌺", "🥥"].map((icon, i) => (
                                <div
                                    key={i}
                                    className="bg-white border-2 border-orange-100 hover:border-orange-400 rounded-2xl h-16 flex items-center justify-center text-2xl cursor-pointer transition-all shadow-sm hover:shadow-md"
                                >
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Product Info ── */}
                    <div className="flex flex-col justify-start gap-6">
                        {/* Name */}
                        <div>
                            <h1
                                className="text-3xl sm:text-4xl font-bold text-orange-950 leading-tight mb-3"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                {product.name}
                            </h1>

                            {/* Rating & reviews */}
                            <div className="flex items-center gap-3 mb-1">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-amber-400 text-base">★</span>
                                    ))}
                                </div>
                                <span className="text-orange-600 text-sm font-medium">4.9 (120+ orders)</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-orange-800/75 leading-relaxed text-[15px] border-l-4 border-amber-400 pl-4">
                            {product.description}
                        </p>

                        {/* Price block */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl px-6 py-5 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-orange-500 text-xs font-semibold uppercase tracking-wider mb-1">Price</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-4xl font-extrabold text-orange-700">₹{product.price}</span>
                                    <span className="text-orange-400 text-base">/ kit</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-1">
                                    ✓ In Stock
                                </span>
                                <p className="text-orange-500 text-xs">Ready for delivery</p>
                            </div>
                        </div>

                        {/* Primary CTA: Order on WhatsApp */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all shadow-xl hover:shadow-green-300/60 hover:-translate-y-0.5"
                        >
                            <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white flex-shrink-0">
                                <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.74.7 5.37 2.04 7.69L.5 31.5l8.09-2.12A15.43 15.43 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm7.68 18.59c-.42-.21-2.5-1.23-2.88-1.37-.39-.14-.67-.21-.95.21-.28.42-1.09 1.37-1.34 1.65-.25.28-.49.32-.91.1-.42-.21-1.78-.66-3.4-2.1-1.26-1.12-2.1-2.5-2.35-2.92-.25-.42-.03-.65.19-.86.2-.19.42-.49.63-.74.21-.25.28-.42.42-.7.14-.28.07-.53-.03-.74-.1-.21-.95-2.28-1.3-3.12-.34-.82-.69-.71-.95-.72l-.81-.01c-.28 0-.74.1-1.13.53-.39.42-1.47 1.44-1.47 3.5s1.51 4.06 1.72 4.34c.21.28 2.97 4.53 7.19 6.35.99.43 1.77.69 2.37.88.99.31 1.9.27 2.62.16.8-.12 2.5-1.02 2.85-2 .35-.98.35-1.82.25-2-.1-.17-.38-.27-.8-.49z" />
                            </svg>
                            Order on WhatsApp
                        </a>

                        {/* Secondary CTA: Call */}
                        <a
                            href="tel:+919876543210"
                            className="flex items-center justify-center gap-2 bg-white hover:bg-orange-50 border-2 border-orange-300 hover:border-orange-500 text-orange-800 font-semibold py-3.5 px-6 rounded-2xl transition-all"
                        >
                            <span className="text-xl">📞</span>
                            Call to Order: +91 98765 43210
                        </a>

                        {/* Trust badges */}
                        <div className="grid grid-cols-2 gap-3 mt-1">
                            {[
                                { icon: "🌿", text: "100% Authentic" },
                                { icon: "📦", text: "Neatly Packed" },
                                { icon: "🚚", text: "Same-Day Delivery" },
                                { icon: "💬", text: "Free Puja Guidance" },
                            ].map((badge) => (
                                <div
                                    key={badge.text}
                                    className="flex items-center gap-2 bg-white border border-orange-100 rounded-xl px-3 py-2.5 text-sm text-orange-900 shadow-sm"
                                >
                                    <span className="text-base">{badge.icon}</span>
                                    <span className="font-medium">{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
            WHAT'S INCLUDED
        ═══════════════════════════════════════════ */}
                <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden mb-10">
                    {/* Section header */}
                    <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-5 flex items-center gap-3">
                        <span className="text-2xl">📦</span>
                        <div>
                            <h2
                                className="text-white font-bold text-xl"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                What&apos;s Included in This Kit
                            </h2>
                            <p className="text-orange-100 text-sm">{product.items.length} items — everything you need</p>
                        </div>
                    </div>

                    {/* Checklist grid */}
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 group bg-orange-50/50 hover:bg-orange-50 border border-orange-100 hover:border-orange-300 rounded-xl px-4 py-3.5 transition-all"
                            >
                                {/* Check icon */}
                                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-white stroke-[3]" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span className="text-orange-900 text-sm font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Order nudge inside section */}
                    <div className="mx-8 mb-8 bg-green-50 border border-green-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-green-800 font-semibold">Ready to order this kit?</p>
                            <p className="text-green-600 text-sm">Click below and we&apos;ll get it delivered to you today.</p>
                        </div>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-md"
                        >
                            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white flex-shrink-0">
                                <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.74.7 5.37 2.04 7.69L.5 31.5l8.09-2.12A15.43 15.43 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm7.68 18.59c-.42-.21-2.5-1.23-2.88-1.37-.39-.14-.67-.21-.95.21-.28.42-1.09 1.37-1.34 1.65-.25.28-.49.32-.91.1-.42-.21-1.78-.66-3.4-2.1-1.26-1.12-2.1-2.5-2.35-2.92-.25-.42-.03-.65.19-.86.2-.19.42-.49.63-.74.21-.25.28-.42.42-.7.14-.28.07-.53-.03-.74-.1-.21-.95-2.28-1.3-3.12-.34-.82-.69-.71-.95-.72l-.81-.01c-.28 0-.74.1-1.13.53-.39.42-1.47 1.44-1.47 3.5s1.51 4.06 1.72 4.34c.21.28 2.97 4.53 7.19 6.35.99.43 1.77.69 2.37.88.99.31 1.9.27 2.62.16.8-.12 2.5-1.02 2.85-2 .35-.98.35-1.82.25-2-.1-.17-.38-.27-.8-.49z" />
                            </svg>
                            Order Now
                        </a>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
            YOU MAY ALSO LIKE
        ═══════════════════════════════════════════ */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2
                            className="text-2xl font-bold text-orange-900 mb-6"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            🕉️ You May Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {relatedProducts.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/product/${p.id}`}
                                    className="bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-5 flex items-center gap-4 group"
                                >
                                    <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center text-4xl flex-shrink-0">
                                        {emojiMap[p.id] ?? "🪔"}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-semibold text-orange-900 group-hover:text-orange-600 transition-colors text-sm leading-snug mb-1 truncate">
                                            {p.name}
                                        </div>
                                        <div className="text-orange-600 font-bold text-base">₹{p.price}</div>
                                        <div className="text-orange-400 text-xs">{p.category}</div>
                                    </div>
                                    <span className="ml-auto text-orange-300 group-hover:text-orange-600 transition-colors text-lg flex-shrink-0">›</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
