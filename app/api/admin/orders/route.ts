import { NextRequest, NextResponse } from "next/server";
import { query, isDbConnected } from "@/lib/db";

interface OrderRow {
    id: number;
    customer_id: number;
    product_id: string;
    quantity: number;
    status: string;
    created_at: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    product_name: string;
    product_price: number;
}

const BASE_QUERY = `
  SELECT
    o.id, o.customer_id, o.product_id, o.quantity, o.status, o.created_at,
    c.name  AS customer_name,
    c.phone AS customer_phone,
    c.email AS customer_email,
    p.name  AS product_name,
    p.price AS product_price
  FROM orders o
  JOIN customers c ON c.id = o.customer_id
  JOIN products  p ON p.id = o.product_id
`;

/** GET /api/admin/orders — list all orders with customer + product info */
export async function GET() {
    const dbOk = await isDbConnected();
    if (!dbOk) {
        return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    try {
        const rows = await query<OrderRow>(BASE_QUERY + " ORDER BY o.created_at DESC");
        return NextResponse.json(rows);
    } catch (err) {
        console.error("[admin/orders GET]", err);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

/** PATCH /api/admin/orders — update order status */
export async function PATCH(request: NextRequest) {
    const dbOk = await isDbConnected();
    if (!dbOk) {
        return NextResponse.json({ error: "Database not connected" }, { status: 503 });
    }

    try {
        const body = await request.json();
        const { id, status } = body as { id?: number; status?: string };

        if (!id || !status) {
            return NextResponse.json({ error: "id and status are required" }, { status: 400 });
        }

        const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Valid: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        const rows = await query<OrderRow>(
            `UPDATE orders SET status = $2 WHERE id = $1 RETURNING id, status`,
            [id, status]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        return NextResponse.json(rows[0]);
    } catch (err) {
        console.error("[admin/orders PATCH]", err);
        return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
    }
}
