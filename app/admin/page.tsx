import { query, isDbConnected } from "@/lib/db";
import Link from "next/link";

interface StatRow { count: string }
interface RecentOrder {
    id: number;
    customer_name: string;
    product_name: string;
    quantity: number;
    status: string;
    created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
};

async function getDashboardData() {
    const dbOk = await isDbConnected();
    if (!dbOk) {
        return { productCount: "—", orderCount: "—", pendingCount: "—", recentOrders: [] as RecentOrder[], dbConnected: false };
    }

    try {
        const [[productRow], [orderRow], [pendingRow], recentOrders] = await Promise.all([
            query<StatRow>("SELECT COUNT(*) as count FROM products"),
            query<StatRow>("SELECT COUNT(*) as count FROM orders"),
            query<StatRow>("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"),
            query<RecentOrder>(
                `SELECT o.id, c.name AS customer_name, p.name AS product_name,
                o.quantity, o.status, o.created_at
         FROM orders o
         JOIN customers c ON c.id = o.customer_id
         JOIN products  p ON p.id = o.product_id
         ORDER BY o.created_at DESC LIMIT 5`
            ),
        ]);
        return {
            productCount: productRow?.count ?? "0",
            orderCount: orderRow?.count ?? "0",
            pendingCount: pendingRow?.count ?? "0",
            recentOrders,
            dbConnected: true,
        };
    } catch {
        return { productCount: "—", orderCount: "—", pendingCount: "—", recentOrders: [] as RecentOrder[], dbConnected: false };
    }
}

export default async function AdminDashboard() {
    const { productCount, orderCount, pendingCount, recentOrders, dbConnected } = await getDashboardData();

    const stats = [
        { label: "Total Products", value: productCount, icon: "📦", color: "from-orange-500 to-amber-400", link: "/admin/products" },
        { label: "Total Orders", value: orderCount, icon: "🛒", color: "from-blue-500 to-indigo-400", link: "/admin/orders" },
        { label: "Pending Orders", value: pendingCount, icon: "⏳", color: "from-yellow-500 to-orange-400", link: "/admin/orders" },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening in your store.</p>
            </div>

            {/* DB status warning */}
            {!dbConnected && (
                <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-4 text-sm">
                    <span className="text-lg mt-0.5">⚠️</span>
                    <div>
                        <div className="font-semibold">Database not connected</div>
                        <div className="text-amber-700 mt-0.5">
                            Configure your PostgreSQL credentials in <code className="bg-amber-100 px-1 rounded">.env.local</code> to see live stats and manage data.
                        </div>
                    </div>
                </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 lg:mb-10">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.link} className="group block">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group-hover:-translate-y-0.5">
                            <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center text-2xl shadow-lg mb-4`}>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 lg:mb-10">
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-2xl px-6 py-4 font-semibold hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-orange-200"
                >
                    <span className="text-2xl">➕</span>
                    <div>
                        <div className="text-sm font-bold">Add New Product</div>
                        <div className="text-orange-100 text-xs">Create a puja kit listing</div>
                    </div>
                </Link>
                <Link
                    href="/admin/orders"
                    className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 rounded-2xl px-6 py-4 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                    <span className="text-2xl">📋</span>
                    <div>
                        <div className="text-sm font-bold">View Orders</div>
                        <div className="text-gray-400 text-xs">Manage & update statuses</div>
                    </div>
                </Link>
            </div>

            {/* Recent orders table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Last 5 orders received</p>
                    </div>
                    <Link href="/admin/orders" className="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                        View all →
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400">
                        <div className="text-4xl mb-3">🛒</div>
                        <div className="font-medium">{dbConnected ? "No orders yet" : "Connect database to view orders"}</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-3 text-left font-semibold">Order</th>
                                    <th className="px-6 py-3 text-left font-semibold">Customer</th>
                                    <th className="px-6 py-3 text-left font-semibold">Product</th>
                                    <th className="px-6 py-3 text-left font-semibold">Qty</th>
                                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 font-mono text-gray-500 text-xs">#{order.id}</td>
                                        <td className="px-6 py-3 font-medium text-gray-900">{order.customer_name}</td>
                                        <td className="px-6 py-3 text-gray-600 truncate max-w-[180px]">{order.product_name}</td>
                                        <td className="px-6 py-3 text-gray-600">{order.quantity}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-400 text-xs whitespace-nowrap">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
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
