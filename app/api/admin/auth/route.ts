import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken, COOKIE_NAME } from "@/lib/admin-auth";

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

/** POST /api/admin/auth — validate password, set auth cookie */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body as { password?: string };

        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        if (!ADMIN_PASSWORD) {
            return NextResponse.json(
                {
                    error:
                        "ADMIN_PASSWORD is not set. Please add it to your .env.local file.",
                },
                { status: 500 }
            );
        }

        if (!password || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: "Incorrect password. Please try again." },
                { status: 401 }
            );
        }

        const token = generateAdminToken();
        const response = NextResponse.json({ success: true });
        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: COOKIE_MAX_AGE,
            path: "/",
        });
        return response;
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

/** DELETE /api/admin/auth — clear auth cookie (logout) */
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        maxAge: 0,
        path: "/",
    });
    return response;
}
