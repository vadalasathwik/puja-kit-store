import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_auth";

/** Compute HMAC-SHA256 of "admin-session" using the secret (Web Crypto — Edge-compatible). */
async function verifyToken(token: string, secret: string): Promise<boolean> {
    try {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const key = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const msgData = encoder.encode("admin-session");
        const sigBuf = await crypto.subtle.sign("HMAC", key, msgData);
        const expected = Array.from(new Uint8Array(sigBuf))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return token === expected;
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip auth check for the login page and the auth API itself
    if (
        pathname === "/admin/login" ||
        pathname.startsWith("/api/admin/auth")
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value ?? "";
    const secret = process.env.ADMIN_SECRET ?? "default-secret-please-change";
    const isValid = token ? await verifyToken(token, secret) : false;

    if (!isValid) {
        // API routes → 401 JSON
        if (pathname.startsWith("/api/admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Pages → redirect to login
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
