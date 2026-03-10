"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProductRecord } from "@/app/api/products/route";

const CATEGORY_COLORS: Record<string, string> = {
    Festival: "bg-amber-100 text-amber-700",
    "Vrat Puja": "bg-orange-100 text-orange-700",
    Ceremony: "bg-red-100 text-red-700",
    Daily: "bg-yellow-100 text-yellow-700",
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    async function fetchProducts() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/products");
            if (!res.ok) throw new Error("Failed to load products");
            setProducts(await res.json());
        } catch {
            setError("Could not load products. Is the database connected?");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchProducts(); }, []);

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const d = await res.json();
                alert(d.error || "Delete failed");
                return;
            }
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert("Network error during delete");
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""} total`}
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-orange-200 text-sm"
                >
                    <span>➕</span> Add Product
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Table card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400">
                        <svg className="animate-spin w-6 h-6 mr-3 text-orange-400" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading products…
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📦</div>
                        <div className="text-gray-500 font-medium mb-2">No products yet</div>
                        <Link href="/admin/products/new" className="text-orange-600 hover:text-orange-700 text-sm font-semibold">
                            Add your first product →
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-3.5 text-left font-semibold">Product</th>
                                    <th className="px-6 py-3.5 text-left font-semibold">Category</th>
                                    <th className="px-6 py-3.5 text-left font-semibold">Price</th>
                                    <th className="px-6 py-3.5 text-left font-semibold">Badge</th>
                                    <th className="px-6 py-3.5 text-left font-semibold">Items</th>
                                    <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-400 font-mono mt-0.5">{product.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-600"}`}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-orange-700">
                                            ₹{Number(product.price).toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {product.badge ?? <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {product.items?.length ?? 0} items
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    ✏️ Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    disabled={deleting === product.id}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {deleting === product.id ? "⏳" : "🗑️"} Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
