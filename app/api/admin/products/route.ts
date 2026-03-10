import { NextRequest, NextResponse } from "next/server";
import { query, isDbConnected } from "@/lib/db";
import { products as staticProducts } from "@/data/products";
import type { ProductRecord } from "@/app/api/products/route";

/** GET /api/admin/products — list all products */
export async function GET() {
    const dbOk = await isDbConnected();
    if (dbOk) {
        try {
            const rows = await query<ProductRecord>(
                "SELECT id, name, slug, price, description, image, category, badge, items FROM products ORDER BY name ASC"
            );
            return NextResponse.json(rows);
        } catch (err) {
            console.error("[admin/products GET]", err);
        }
    }
    // Fallback to static data
    return NextResponse.json(staticProducts.map((p) => ({ ...p, slug: p.id })));
}

/** POST /api/admin/products — create a new product */
export async function POST(request: NextRequest) {
    const dbOk = await isDbConnected();
    if (!dbOk) {
        return NextResponse.json(
            { error: "Database not connected. Configure PostgreSQL to add products." },
            { status: 503 }
        );
    }

    try {
        const body = await request.json();
        const { id, name, slug, price, description, image, category, badge, items } = body;

        if (!id || !name || !price) {
            return NextResponse.json({ error: "id, name, and price are required" }, { status: 400 });
        }

        const rows = await query<ProductRecord>(
            `INSERT INTO products (id, name, slug, price, description, image, category, badge, items)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [
                id,
                name,
                slug || id,
                parseFloat(price),
                description || "",
                image || "",
                category || "General",
                badge || null,
                Array.isArray(items) ? items : [],
            ]
        );
        return NextResponse.json(rows[0], { status: 201 });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg.includes("duplicate key")) {
            return NextResponse.json({ error: "A product with this ID already exists." }, { status: 409 });
        }
        console.error("[admin/products POST]", err);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}

/** PUT /api/admin/products — update a product */
export async function PUT(request: NextRequest) {
    const dbOk = await isDbConnected();
    if (!dbOk) {
        return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    try {
        const body = await request.json();
        const { id, name, slug, price, description, image, category, badge, items } = body;

        if (!id) {
            return NextResponse.json({ error: "Product id is required" }, { status: 400 });
        }

        const rows = await query<ProductRecord>(
            `UPDATE products
       SET name=$2, slug=$3, price=$4, description=$5, image=$6, category=$7, badge=$8, items=$9
       WHERE id = $1
       RETURNING *`,
            [
                id,
                name,
                slug || id,
                parseFloat(price),
                description || "",
                image || "",
                category || "General",
                badge || null,
                Array.isArray(items) ? items : [],
            ]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(rows[0]);
    } catch (err) {
        console.error("[admin/products PUT]", err);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

/** DELETE /api/admin/products?id=<slug> — delete a product */
export async function DELETE(request: NextRequest) {
    const dbOk = await isDbConnected();
    if (!dbOk) {
        return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    try {
        const rows = await query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
        if (rows.length === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, deleted: id });
    } catch (err) {
        console.error("[admin/products DELETE]", err);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
