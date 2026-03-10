import { NextRequest, NextResponse } from "next/server";
import { query, isDbConnected } from "@/lib/db";

/**
 * POST /api/orders
 *
 * Body JSON:
 * {
 *   product_id:       string   (product slug, e.g. "ganesh-puja-kit")
 *   quantity:         number   (default 1)
 *   customer_name:    string
 *   customer_phone:   string
 *   customer_email?:  string
 * }
 *
 * Upserts a customer and inserts an order into PostgreSQL.
 * Returns 503 if no database is available.
 */
export async function POST(request: NextRequest) {
    const dbAvailable = await isDbConnected();

    if (!dbAvailable) {
        return NextResponse.json(
            {
                error:
                    "Database not connected. Please configure PostgreSQL credentials in .env.local and run lib/schema.sql to set up the database.",
            },
            { status: 503 }
        );
    }

    let body: {
        product_id?: string;
        quantity?: number;
        customer_name?: string;
        customer_phone?: string;
        customer_email?: string;
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
        product_id,
        quantity = 1,
        customer_name,
        customer_phone,
        customer_email,
    } = body;

    // Basic validation
    if (!product_id || !customer_name || !customer_phone) {
        return NextResponse.json(
            { error: "product_id, customer_name, and customer_phone are required" },
            { status: 400 }
        );
    }

    try {
        // Upsert customer (match by phone number)
        const customerRows = await query<{ id: number }>(
            `INSERT INTO customers (name, phone, email)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING id`,
            [customer_name, customer_phone, customer_email ?? null]
        );

        let customerId: number;

        if (customerRows.length > 0) {
            customerId = customerRows[0].id;
        } else {
            // Customer already exists — fetch their id
            const existing = await query<{ id: number }>(
                "SELECT id FROM customers WHERE phone = $1",
                [customer_phone]
            );
            customerId = existing[0].id;
        }

        // Insert order
        const orderRows = await query<{
            id: number;
            customer_id: number;
            product_id: string;
            quantity: number;
            status: string;
            created_at: string;
        }>(
            `INSERT INTO orders (customer_id, product_id, quantity, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
            [customerId, product_id, quantity]
        );

        return NextResponse.json(orderRows[0], { status: 201 });
    } catch (err) {
        console.error("[api/orders] Error creating order:", err);
        return NextResponse.json(
            { error: "Failed to create order. Please try again." },
            { status: 500 }
        );
    }
}

/**
 * GET /api/orders
 * Returns all orders with customer info (for admin use).
 */
export async function GET() {
    const dbAvailable = await isDbConnected();

    if (!dbAvailable) {
        return NextResponse.json(
            { error: "Database not connected" },
            { status: 503 }
        );
    }

    try {
        const rows = await query(
            `SELECT
         o.id, o.quantity, o.status, o.created_at,
         o.product_id,
         c.name  AS customer_name,
         c.phone AS customer_phone,
         c.email AS customer_email
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       ORDER BY o.created_at DESC`
        );
        return NextResponse.json(rows);
    } catch (err) {
        console.error("[api/orders] Error fetching orders:", err);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
