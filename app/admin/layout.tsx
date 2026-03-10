"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/orders", label: "Orders", icon: "🛒" },
];

interface SidebarProps {
    onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
    }

    return (
        <>
            {/* Brand */}
            <div className="px-5 py-5 border-b border-orange-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-lg shadow-lg flex-shrink-0">
                        🕉️
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm leading-tight">Puja Kit Store</div>
                        <div className="text-orange-400 text-xs">Admin Panel</div>
                    </div>
                </div>
                {/* Close button — mobile only */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden text-orange-300 hover:text-white p-1 rounded-lg hover:bg-orange-800/50 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                                : "text-orange-200 hover:bg-orange-800/50 hover:text-white"
                                }`}
                        >
                            <span className="text-base w-5 text-center">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer links */}
            <div className="px-3 py-4 border-t border-orange-800/50 space-y-1">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-orange-300 hover:text-white hover:bg-orange-800/50 transition-all"
                >
                    <span className="text-base w-5 text-center">🌐</span>
                    View Store
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-orange-300 hover:text-red-300 hover:bg-red-900/30 transition-all text-left"
                >
                    <span className="text-base w-5 text-center">🚪</span>
                    Logout
                </button>
            </div>
        </>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="fixed inset-0 z-[9999] flex bg-gray-50 overflow-hidden">

            {/* ── DESKTOP SIDEBAR ───────────────────────────── */}
            <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-gradient-to-b from-orange-950 to-amber-950 h-full border-r border-orange-800/30 overflow-hidden">
                <SidebarContent />
            </aside>

            {/* ── MOBILE SIDEBAR DRAWER ─────────────────────── */}
            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[110] bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Drawer */}
            <aside
                className={`fixed top-0 left-0 z-[120] h-full w-64 bg-gradient-to-b from-orange-950 to-amber-950 flex flex-col transform transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* ── MAIN CONTENT AREA ─────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile top bar */}
                <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Open menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🕉️</span>
                        <span className="font-bold text-gray-800 text-sm">Admin Panel</span>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
