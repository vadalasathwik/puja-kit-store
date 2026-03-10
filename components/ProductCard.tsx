import Link from "next/link";
import { Product } from "@/data/products";

interface ProductCardProps {
    product: Product;
}

const categoryColors: Record<string, string> = {
    Festival: "bg-amber-100 text-amber-700",
    "Vrat Puja": "bg-orange-100 text-orange-700",
    Ceremony: "bg-red-100 text-red-700",
    Daily: "bg-yellow-100 text-yellow-700",
};

const badgeColors: Record<string, string> = {
    Bestseller: "bg-green-500",
    Popular: "bg-blue-500",
    Premium: "bg-purple-600",
    "Value Pack": "bg-orange-500",
};

export default function ProductCard({ product }: ProductCardProps) {
    const categoryClass =
        categoryColors[product.category] ?? "bg-orange-100 text-orange-700";
    const badgeColor = product.badge
        ? (badgeColors[product.badge] ?? "bg-orange-500")
        : null;

    return (
        <div className="product-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-orange-100 flex flex-col">
            {/* Image area */}
            <div className="relative h-52 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center overflow-hidden">
                {/* Decorative mandala pattern */}
                <div className="absolute inset-0 opacity-10 mandala-bg" />
                <span className="text-7xl z-10 animate-float select-none">
                    {product.id === "ganesh-puja-kit" && "🐘"}
                    {product.id === "satyanarayana-puja-kit" && "🪔"}
                    {product.id === "gruhapravesam-puja-kit" && "🏠"}
                    {product.id === "daily-puja-kit" && "🌸"}
                </span>
                {/* Badge */}
                {product.badge && badgeColor && (
                    <div
                        className={`absolute top-3 right-3 ${badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}
                    >
                        {product.badge}
                    </div>
                )}
                {/* Category */}
                <div
                    className={`absolute bottom-3 left-3 ${categoryClass} text-xs font-semibold px-2.5 py-1 rounded-full`}
                >
                    {product.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-orange-900 font-bold text-lg mb-2 leading-snug">
                    {product.name}
                </h3>
                <p className="text-orange-700/70 text-sm leading-relaxed line-clamp-2 mb-4">
                    {product.description}
                </p>

                {/* Items count */}
                <div className="flex items-center gap-1.5 mb-4 text-xs text-orange-500">
                    <span>📦</span>
                    <span>{product.items.length} items included</span>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-orange-700">
                            ₹{product.price}
                        </span>
                        <span className="text-orange-400 text-sm ml-1">/ kit</span>
                    </div>
                    <Link
                        href={`/product/${product.id}`}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:from-orange-600 hover:to-amber-600 transition-all shadow hover:shadow-orange-300"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
