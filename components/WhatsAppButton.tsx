"use client";

export default function WhatsAppButton() {
    const phoneNumber = "919876543210";
    const message = "Hello, I want to order a Puja Kit.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Chat on WhatsApp"
        >
            <div className="relative flex items-center">
                {/* Tooltip */}
                <div className="absolute right-16 bg-white text-green-800 text-sm font-medium px-4 py-2 rounded-xl shadow-lg border border-green-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none">
                    Chat with us on WhatsApp
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-green-100 rotate-45" />
                </div>

                {/* Button */}
                <div className="w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-green-300">
                    {/* WhatsApp SVG icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="w-8 h-8 fill-white"
                    >
                        <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.74.7 5.37 2.04 7.69L.5 31.5l8.09-2.12A15.43 15.43 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.19a13.54 13.54 0 0 1-6.94-1.9l-.5-.3-5.17 1.36 1.38-5.06-.33-.52A13.56 13.56 0 1 1 16 28.69zm7.68-10.2c-.42-.21-2.5-1.23-2.88-1.37-.39-.14-.67-.21-.95.21-.28.42-1.09 1.37-1.34 1.65-.25.28-.49.32-.91.1-.42-.21-1.78-.66-3.4-2.1-1.26-1.12-2.1-2.5-2.35-2.92-.25-.42-.03-.65.19-.86.2-.19.42-.49.63-.74.21-.25.28-.42.42-.7.14-.28.07-.53-.03-.74-.1-.21-.95-2.28-1.3-3.12-.34-.82-.69-.71-.95-.72l-.81-.01c-.28 0-.74.1-1.13.53-.39.42-1.47 1.44-1.47 3.5s1.51 4.06 1.72 4.34c.21.28 2.97 4.53 7.19 6.35.99.43 1.77.69 2.37.88.99.31 1.9.27 2.62.16.8-.12 2.5-1.02 2.85-2 .35-.98.35-1.82.25-2 -.1-.17-.38-.27-.8-.49z" />
                    </svg>
                </div>

                {/* Ping ring */}
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30 pointer-events-none" />
            </div>
        </a>
    );
}
