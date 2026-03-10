import { notFound } from "next/navigation";
import Link from "next/link";
import { products as staticProducts, getProductById } from "@/data/products";
import type { Product } from "@/data/products";
import type { ProductRecord } from "@/app/api/products/route";
import type { Metadata } from "next";

/* ----------------------------------------------------
   Fetch product from API
---------------------------------------------------- */
async function getProductFromApi(id: string): Promise<Product | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/products?id=${encodeURIComponent(id)}`,
            {
                next: { revalidate: 60 },
            }
        );

        if (res.status === 404) return null;
        if (!res.ok) throw new Error("API error");

        const data: ProductRecord = await res.json();

        return {
            ...data,
            badge: data.badge ?? undefined,
        };
    } catch {
        // fallback to static data if API fails
        return getProductById(id) ?? null;
    }
}

interface PageProps {
    params: { id: string };
}

/* ----------------------------------------------------
   Static generation
---------------------------------------------------- */
export async function generateStaticParams() {
    return staticProducts.map((p) => ({ id: p.id }));
}

/* ----------------------------------------------------
   SEO Metadata
---------------------------------------------------- */
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const product = await getProductFromApi(params.id);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: `${product.name} | Puja Kit Store Hyderabad`,
        description: product.description,
    };
}

/* ----------------------------------------------------
   UI Maps
---------------------------------------------------- */
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

/* ----------------------------------------------------
   Page
---------------------------------------------------- */
export default async function ProductDetailPage({ params }: PageProps) {
    const product = await getProductFromApi(params.id);

    if (!product) notFound();

    const emoji = emojiMap[product.id] ?? "🪔";
    const gradient = gradientMap[product.id] ?? "from-orange-50 to-amber-50";
    const accent = accentMap[product.id] ?? "bg-orange-600";

    const whatsappMsg = `Hello, I want to order ${product.name}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
        whatsappMsg
    )}`;

    const relatedProducts = staticProducts
        .filter((p) => p.id !== product.id)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-amber-50/30">

            {/* Breadcrumb */}
            <div className="bg-white border-b border-orange-100">
                <div className="container py-3.5 flex items-center gap-2 text-sm flex-wrap">
                    <Link
                        href="/"
                        className="text-orange-500 hover:text-orange-700 transition-colors font-medium"
                    >
                        Home
                    </Link>

                    <span className="text-orange-300">›</span>

                    <Link
                        href="/products"
                        className="text-orange-500 hover:text-orange-700 transition-colors font-medium"
                    >
                        Products
                    </Link>

                    <span className="text-orange-300">›</span>

                    <span className="text-orange-900 font-semibold truncate max-w-xs">
                        {product.name}
                    </span>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container py-8 lg:py-14">

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14">

                    {/* LEFT SIDE IMAGE */}
                    <div
                        className={`relative rounded-3xl bg-gradient-to-br ${gradient} overflow-hidden shadow-lg`}
                        style={{ minHeight: "420px" }}
                    >
                        <div className="absolute inset-0 mandala-bg opacity-25" />

                        <div className="flex items-center justify-center h-full py-12 sm:py-16">
                            <span
                                className="text-[80px] sm:text-[140px] leading-none select-none drop-shadow-xl"
                                style={{ animation: "float 3s ease-in-out infinite" }}
                            >
                                {emoji}
                            </span>
                        </div>

                        {product.badge && (
                            <div
                                className={`absolute top-5 right-5 ${accent} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}
                            >
                                ⭐ {product.badge}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE INFO */}
                    <div className="flex flex-col gap-6">

                        <h1
                            className="text-3xl sm:text-4xl font-bold text-orange-950"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {product.name}
                        </h1>

                        <p className="text-orange-800/75 leading-relaxed">
                            {product.description}
                        </p>

                        {/* PRICE */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl px-6 py-5">
                            <span className="text-4xl font-extrabold text-orange-700">
                                ₹{product.price}
                            </span>
                        </div>

                        {/* WHATSAPP CTA */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all shadow-xl"
                        >
                            Order on WhatsApp
                        </a>
                    </div>
                </div>

                {/* ITEMS LIST */}
                <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-8 mb-10">
                    <h2 className="text-xl font-bold text-orange-900 mb-6">
                        What's Included
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3"
                            >
                                <span className="text-green-600">✔</span>
                                <span className="text-orange-900 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-orange-900 mb-6">
                            You May Also Like
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {relatedProducts.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/product/${p.id}`}
                                    className="bg-white rounded-2xl border border-orange-100 p-5 flex items-center gap-4"
                                >
                                    <div className="text-4xl">{emojiMap[p.id] ?? "🪔"}</div>

                                    <div>
                                        <div className="font-semibold text-orange-900 text-sm">
                                            {p.name}
                                        </div>

                                        <div className="text-orange-600 font-bold">
                                            ₹{p.price}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}