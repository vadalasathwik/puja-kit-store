"use client";

import { useEffect, useState } from "react";

interface Order {
    id: number;
    customer_id: number;
    product_id: string;
    quantity: number;
    status: string;
    created_at: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    product_name: string;
    product_price: number;
}

const STATUS_OPTIONS = ["pending", "confirmed", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_ICONS: Record<string, string> = {
    pending: "⏳",
    confirmed: "✅",
    delivered: "🚚",
    cancelled: "❌",
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState<number | null>(null);
    const [filter, setFilter] = useState<string>("all");

    async function fetchOrders() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/orders");
            if (!res.ok) {
                const d = await res.json();
                setError(d.error || "Failed to load orders");
                return;
            }
            setOrders(await res.json());
        } catch {
            setError("Could not load orders. Is the database connected?");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchOrders(); }, []);

    async function handleStatusChange(orderId: number, newStatus: string) {
        setUpdating(orderId);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: orderId, status: newStatus }),
            });
            if (!res.ok) {
                const d = await res.json();
                alert(d.error || "Status update failed");
                return;
            }
            setOrders((prev) =>
                prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
            );
        } catch {
            alert("Network error updating status");
        } finally {
            setUpdating(null);
        }
    }

    const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

    const counts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, s) => {
        acc[s] = orders.filter((o) => o.status === s).length;
        return acc;
    }, {});

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {loading ? "Loading…" : `${orders.length} order${orders.length !== 1 ? "s" : ""} total`}
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-xl transition-colors"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Status filter tabs */}
            {!loading && orders.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5 overflow-x-auto pb-1">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${filter === "all"
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                            }`}
                    >
                        All ({orders.length})
                    </button>
                    {STATUS_OPTIONS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border capitalize ${filter === s
                                ? "bg-orange-600 text-white border-orange-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            {STATUS_ICONS[s]} {s} ({counts[s] ?? 0})
                        </button>
                    ))}
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
                        Loading orders…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🛒</div>
                        <div className="text-gray-500 font-medium">
                            {orders.length === 0 ? "No orders received yet" : `No ${filter} orders`}
                        </div>
                        {orders.length === 0 && (
                            <p className="text-gray-400 text-sm mt-2">Orders will appear here when customers place them via WhatsApp/API.</p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-left font-semibold">Order</th>
                                    <th className="px-5 py-3.5 text-left font-semibold">Customer</th>
                                    <th className="px-5 py-3.5 text-left font-semibold">Product</th>
                                    <th className="px-5 py-3.5 text-left font-semibold">Qty</th>
                                    <th className="px-5 py-3.5 text-left font-semibold">Amount</th>
                                    <th className="px-5 py-3.5 text-left font-semibold">Date</th>
                                    <th className="px-5 py-3.5 text-left font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-5 py-4 font-mono text-gray-400 text-xs">#{order.id}</td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-900 text-sm">{order.customer_name}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{order.customer_phone}</div>
                                            {order.customer_email && (
                                                <div className="text-xs text-gray-400">{order.customer_email}</div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="text-gray-800 font-medium text-sm max-w-[200px] truncate">{order.product_name}</div>
                                            <div className="text-xs text-gray-400 font-mono">{order.product_id}</div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 font-medium">{order.quantity}</td>
                                        <td className="px-5 py-4 font-bold text-orange-700">
                                            ₹{(order.product_price * order.quantity).toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })}
                                            <div className="text-gray-300 mt-0.5">
                                                {new Date(order.created_at).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit", minute: "2-digit",
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                                    {STATUS_ICONS[order.status]} {order.status}
                                                </span>
                                                {updating === order.id ? (
                                                    <svg className="animate-spin w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                ) : (
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                                                    >
                                                        {STATUS_OPTIONS.map((s) => (
                                                            <option key={s} value={s} className="capitalize">{s}</option>
                                                        ))}
                                                    </select>
                                                )}
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
