"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        kit: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const msg = `Hello! I'm ${formData.name}. I'm interested in: ${formData.kit || "a puja kit"}. ${formData.message}. Phone: ${formData.phone}`;
        const url = `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
        setSubmitted(true);
    }

    return (
        <div className="min-h-screen bg-amber-50/30">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 text-white py-10 sm:py-14">
                <div className="container text-center">
                    <p className="text-orange-200 uppercase text-sm font-semibold tracking-widest mb-3 text-center">
                        📞 Get in Touch
                    </p>
                    <h1
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Contact Us
                    </h1>
                    <p className="text-orange-200 mt-3 max-w-md mx-auto text-sm sm:text-base text-center">
                        Have questions about our kits? We&apos;re here to help you choose the right puja kit.
                    </p>
                </div>
            </div>

            <div className="container py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl shadow-md border border-orange-100 p-8">
                        <h2
                            className="text-2xl font-bold text-orange-900 mb-6"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Send Us a Message
                        </h2>

                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-xl font-bold text-orange-900 mb-2">
                                    Redirecting to WhatsApp!
                                </h3>
                                <p className="text-orange-700/70 mb-6">
                                    Your message has been sent. We&apos;ll respond within 30 minutes.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-orange-600 hover:text-orange-800 underline text-sm"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-orange-800 font-semibold text-sm mb-1.5">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className="w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl px-4 py-3 text-orange-900 placeholder-orange-300 outline-none transition-colors bg-orange-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-orange-800 font-semibold text-sm mb-1.5">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        className="w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl px-4 py-3 text-orange-900 placeholder-orange-300 outline-none transition-colors bg-orange-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-orange-800 font-semibold text-sm mb-1.5">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl px-4 py-3 text-orange-900 placeholder-orange-300 outline-none transition-colors bg-orange-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-orange-800 font-semibold text-sm mb-1.5">
                                        Interested Kit
                                    </label>
                                    <select
                                        name="kit"
                                        value={formData.kit}
                                        onChange={handleChange}
                                        className="w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl px-4 py-3 text-orange-900 outline-none transition-colors bg-orange-50/50"
                                    >
                                        <option value="">Select a kit (optional)</option>
                                        <option value="Ganesh Puja Kit (₹499)">Ganesh Puja Kit (₹499)</option>
                                        <option value="Satyanarayana Puja Kit (₹799)">Satyanarayana Puja Kit (₹799)</option>
                                        <option value="Gruhapravesam Puja Kit (₹1299)">Gruhapravesam Puja Kit (₹1299)</option>
                                        <option value="Daily Puja Kit (₹299)">Daily Puja Kit (₹299)</option>
                                        <option value="Custom Kit">Custom Kit</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-orange-800 font-semibold text-sm mb-1.5">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Ask us anything — ceremony date, delivery location, custom requirements..."
                                        className="w-full border-2 border-orange-200 focus:border-orange-500 rounded-xl px-4 py-3 text-orange-900 placeholder-orange-300 outline-none transition-colors bg-orange-50/50 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-green-200 flex items-center justify-center gap-2"
                                >
                                    <span className="text-lg">💬</span>
                                    Send on WhatsApp
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        {/* Quick contact cards */}
                        <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
                            <h3 className="text-green-800 font-bold text-lg mb-4 flex items-center gap-2">
                                <span>📱</span> WhatsApp (Fastest Response)
                            </h3>
                            <a
                                href="https://wa.me/919876543210"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-all shadow-md"
                            >
                                Chat: +91 98765 43210
                            </a>
                            <p className="text-green-700/70 text-sm mt-3">
                                Typically responds within 30 minutes (9 AM – 8 PM)
                            </p>
                        </div>

                        <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-orange-900 font-bold text-lg mb-4">
                                📍 Our Details
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    {
                                        icon: "📍",
                                        label: "Address",
                                        value: "Hyderabad, Telangana, India",
                                    },
                                    {
                                        icon: "📞",
                                        label: "Phone",
                                        value: "+91 98765 43210",
                                        href: "tel:+919876543210",
                                    },
                                    {
                                        icon: "✉️",
                                        label: "Email",
                                        value: "info@pujakitstore.in",
                                        href: "mailto:info@pujakitstore.in",
                                    },
                                    {
                                        icon: "⏰",
                                        label: "Hours",
                                        value: "Monday – Sunday: 9 AM – 8 PM",
                                    },
                                ].map((item) => (
                                    <li key={item.label} className="flex items-start gap-3">
                                        <span className="text-xl mt-0.5">{item.icon}</span>
                                        <div>
                                            <div className="text-orange-500 text-xs font-semibold uppercase tracking-wide">
                                                {item.label}
                                            </div>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="text-orange-900 hover:text-orange-600 transition-colors"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <div className="text-orange-900">{item.value}</div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Delivery info */}
                        <div className="bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 rounded-3xl p-6">
                            <h3 className="text-orange-900 font-bold text-lg mb-3">
                                🚚 Delivery Information
                            </h3>
                            <ul className="space-y-2 text-orange-800 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Same-day delivery for orders before 12 PM
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Delivery across Hyderabad &amp; Secunderabad
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    Advance booking available for upcoming pujas
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
