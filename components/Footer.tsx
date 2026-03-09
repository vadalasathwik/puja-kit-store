import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-orange-950 to-amber-950 text-orange-100 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🪔</span>
                            <div>
                                <div className="text-xl font-bold text-amber-300">
                                    Puja Kit Store
                                </div>
                                <div className="text-xs text-orange-400 tracking-widest uppercase">
                                    Hyderabad
                                </div>
                            </div>
                        </div>
                        <p className="text-orange-300 text-sm leading-relaxed">
                            Bringing divine blessings to your home with authentic, ready-made
                            puja kits crafted with love and devotion.
                        </p>
                        <div className="flex gap-3 mt-5">
                            <a
                                href="https://wa.me/919876543210"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition-colors"
                                aria-label="WhatsApp"
                            >
                                <span className="text-sm">📱</span>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-orange-700 hover:bg-orange-600 flex items-center justify-center transition-colors"
                                aria-label="Instagram"
                            >
                                <span className="text-sm">📸</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-amber-300 font-semibold mb-4 uppercase tracking-wider text-sm">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/products", label: "All Products" },
                                { href: "/contact", label: "Contact Us" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-orange-300 hover:text-amber-300 text-sm transition-colors"
                                    >
                                        → {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-amber-300 font-semibold mb-4 uppercase tracking-wider text-sm">
                            Contact Us
                        </h4>
                        <ul className="space-y-3 text-orange-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">📍</span>
                                <span>Hyderabad, Telangana, India</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📞</span>
                                <a
                                    href="tel:+919876543210"
                                    className="hover:text-amber-300 transition-colors"
                                >
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>✉️</span>
                                <a
                                    href="mailto:info@pujakitstore.in"
                                    className="hover:text-amber-300 transition-colors"
                                >
                                    info@pujakitstore.in
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>⏰</span>
                                <span>Mon–Sun: 9 AM – 8 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-orange-800/50 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-orange-500 text-xs">
                        © {new Date().getFullYear()} Puja Kit Store, Hyderabad. All rights
                        reserved.
                    </p>
                    <p className="text-orange-600 text-xs">
                        🙏 Crafted with devotion & care
                    </p>
                </div>
            </div>
        </footer>
    );
}
