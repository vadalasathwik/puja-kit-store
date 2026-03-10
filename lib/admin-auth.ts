import crypto from "crypto";

const COOKIE_NAME = "admin_auth";

/** Generate the expected HMAC-SHA256 token using Node's crypto module. */
export function generateAdminToken(): string {
    const secret = process.env.ADMIN_SECRET ?? "default-secret-please-change";
    return crypto
        .createHmac("sha256", secret)
        .update("admin-session")
        .digest("hex");
}

export { COOKIE_NAME };
