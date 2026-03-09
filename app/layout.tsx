import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Puja Kit Store Hyderabad | Ready-made Puja Kits",
  description:
    "Buy authentic ready-made puja kits in Hyderabad. We offer Ganesh Puja Kit, Satyanarayana Puja Kit, Gruhapravesam Kit, and Daily Puja Kits — delivered to your doorstep.",
  keywords:
    "puja kit, puja kit store, Hyderabad puja kit, Ganesh puja, Satyanarayana puja, Gruhapravesam kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="bg-amber-50/30"
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
