import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";
import type { Product } from "@/data/products";
import type { ProductRecord } from "@/app/api/products/route";

/* -------------------------------------------------------
   Fetch Products
------------------------------------------------------- */
async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/products`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) throw new Error("Failed to fetch products");

        const data: ProductRecord[] = await res.json();

        return data.map((p) => ({
            ...p,
            badge: p.badge ?? undefined,
        }));
    } catch (error) {
        console.error("Products API failed:", error);
        return [];
    }
}

/* -------------------------------------------------------
   SEO Metadata
------------------------------------------------------- */
export const metadata: Metadata = {
    title: "Puja Kits | Puja Kit Store Hyderabad",
    description:
        "Explore our collection of authentic ready-made puja kits. Choose the perfect puja kit for your spiritual rituals, festivals, and daily worship.",
};

/* -------------------------------------------------------
   Page
------------------------------------------------------- */
export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-amber-50/30 pb-20">

            {/* PAGE HEADER */}
            <section className="relative overflow-hidden bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 text-white py-16 lg:py-24">

                <div className="absolute inset-0 mandala-bg opacity-10" />

                <div className="relative container text-center">
                    <span className="inline-block bg-white/20 text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
                        🕉️ Our Collection
                    </span>

                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Puja Kits
                    </h1>

                    <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                        Choose the perfect puja kit for your spiritual rituals.
                    </p>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="container py-12 lg:py-16">

                {/* CATEGORY FILTER */}
                <div className="flex gap-3 mb-12 overflow-x-auto justify-center flex-wrap">
                    {["All Kits", "Festival", "Vrat Puja", "Ceremony", "Daily"].map(
                        (cat) => (
                            <button
                                key={cat}
                                className="px-6 py-2 rounded-full text-sm font-semibold bg-white border border-orange-200 text-orange-800 hover:border-orange-400 hover:bg-orange-50 transition"
                            >
                                {cat}
                            </button>
                        )
                    )}
                </div>

                {/* PRODUCT GRID */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                ) : (
                    <p className="text-center text-orange-700">
                        No products available right now.
                    </p>
                )}

                {/* CUSTOM KIT CTA */}
                <div className="mt-20 bg-white rounded-3xl border border-orange-100 p-10 text-center shadow-sm max-w-4xl mx-auto">

                    <div className="text-4xl mb-4">✨</div>

                    <h3
                        className="text-2xl font-bold text-orange-900 mb-3"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Can't find a specific kit?
                    </h3>

                    <p className="text-orange-700/70 mb-8 max-w-lg mx-auto">
                        We can assemble custom puja kits for your ritual needs.
                    </p>

                    <a
                        href="https://wa.me/919876543210?text=Hello! I'm looking for a custom puja kit."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg"
                    >
                        💬 Chat for Custom Kits
                    </a>
                </div>

            </section>
        </div>
    );
}