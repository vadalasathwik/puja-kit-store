"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-orange-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">🪔</span>
                        <div>
                            <div className="text-lg font-bold text-orange-700 leading-tight group-hover:text-orange-600 transition-colors">
                                Puja Kit Store
                            </div>
                            <div className="text-xs text-orange-400 leading-none tracking-wide">
                                Hyderabad
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-orange-900 hover:text-orange-600 font-medium transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 after:transition-all hover:after:w-full"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/products"
                            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2 rounded-full font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-orange-200"
                        >
                            Shop Now
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg text-orange-800 hover:bg-orange-50 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" />
                        <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" />
                        <div className="w-6 h-0.5 bg-current transition-all" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-orange-50 border-t border-orange-200 px-4 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block text-orange-900 hover:text-orange-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/products"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
                    >
                        Shop Now
                    </Link>
                </div>
            )}
        </nav>
    );
}
