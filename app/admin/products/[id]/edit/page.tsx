"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { ProductRecord } from "@/app/api/products/route";

const CATEGORIES = ["Festival", "Vrat Puja", "Ceremony", "Daily", "General"];
const BADGES = ["", "Bestseller", "Popular", "Premium", "Value Pack", "New"];

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    const [form, setForm] = useState({
        name: "", id: "", price: "", description: "",
        image: "", category: "Festival", badge: "", itemsText: "",
    });

    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await fetch(`/api/products?id=${encodeURIComponent(productId)}`);
                if (res.status === 404) { setNotFound(true); return; }
                if (!res.ok) throw new Error("Failed to load");
                const p: ProductRecord = await res.json();
                setForm({
                    name: p.name,
                    id: p.id,
                    price: String(p.price),
                    description: p.description ?? "",
                    image: p.image ?? "",
                    category: p.category ?? "Festival",
                    badge: p.badge ?? "",
                    itemsText: (p.items ?? []).join("\n"),
                });
            } catch {
                setError("Could not load product. Is the database connected?");
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [productId]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const items = form.itemsText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);

        try {
            const res = await fetch("/api/admin/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: form.id,
                    name: form.name,
                    slug: form.id,
                    price: parseFloat(form.price),
                    description: form.description,
                    image: form.image,
                    category: form.category,
                    badge: form.badge || null,
                    items,
                }),
            });

            const data = await res.json();
            if (!res.ok) { setError(data.error || "Update failed"); return; }
            router.push("/admin/products");
            router.refresh();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh] text-gray-400">
                <svg className="animate-spin w-6 h-6 mr-3 text-orange-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading product…
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="p-8 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Product not found</h2>
                <Link href="/admin/products" className="text-orange-600 hover:underline text-sm">← Back to products</Link>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors">← Back</Link>
                <div className="w-px h-5 bg-gray-200" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                    <p className="text-gray-500 text-sm mt-0.5 font-mono">{productId}</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50">
                    <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Product Details</h2>
                </div>

                <div className="px-8 py-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                        <input
                            type="text" required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Price + Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
                            <input
                                type="number" required min="1" step="1"
                                value={form.price}
                                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                            >
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Badge + Image */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Badge</label>
                            <select
                                value={form.badge}
                                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                            >
                                {BADGES.map((b) => <option key={b} value={b}>{b || "— None —"}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image Path</label>
                            <input
                                type="text"
                                value={form.image}
                                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                                placeholder="/images/my-kit.jpg"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                        />
                    </div>

                    {/* Items */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Kit Items
                            <span className="ml-2 text-xs font-normal text-gray-400">One item per line</span>
                        </label>
                        <textarea
                            rows={6}
                            value={form.itemsText}
                            onChange={(e) => setForm((f) => ({ ...f, itemsText: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-mono resize-none"
                        />
                    </div>
                </div>

                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                        Cancel
                    </Link>
                    <button
                        type="submit" disabled={saving}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-orange-200 disabled:shadow-none text-sm"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving…
                            </>
                        ) : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
