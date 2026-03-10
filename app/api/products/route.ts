import { NextRequest, NextResponse } from "next/server";
import { query, isDbConnected } from "@/lib/db";
import { products as staticProducts } from "@/data/products";

/** Shape returned by both DB and static sources */
export interface ProductRecord {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    image: string;
    category: string;
    badge?: string | null;
    items: string[];
}

/**
 * GET /api/products
 * GET /api/products?id=<slug>
 *
 * Queries PostgreSQL if available, falls back to static data/products.ts.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const dbAvailable = await isDbConnected();

    if (dbAvailable) {
        try {
            if (id) {
                // Single product by slug/id
                const rows = await query<ProductRecord>(
                    "SELECT id, name, slug, price, description, image, category, badge, items FROM products WHERE id = $1",
                    [id]
                );
                if (rows.length === 0) {
                    return NextResponse.json({ error: "Product not found" }, { status: 404 });
                }
                return NextResponse.json(rows[0]);
            } else {
                // All products
                const rows = await query<ProductRecord>(
                    "SELECT id, name, slug, price, description, image, category, badge, items FROM products ORDER BY price ASC"
                );
                return NextResponse.json(rows);
            }
        } catch (err) {
            console.error("[api/products] DB error, falling back to static data:", err);
            // Fall through to static fallback
        }
    }

    // ── Static fallback ──────────────────────────────────────────────────────
    if (id) {
        const product = staticProducts.find((p) => p.id === id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ ...product, slug: product.id });
    }
    return NextResponse.json(
        staticProducts.map((p) => ({ ...p, slug: p.id }))
    );
}
