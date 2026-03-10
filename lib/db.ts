import { Pool } from "pg";

// Singleton pool — reused across requests in dev (via module caching)
let pool: Pool | null = null;

function getPool(): Pool {
    if (!pool) {
        pool = new Pool({
            host: process.env.PGHOST || "localhost",
            port: parseInt(process.env.PGPORT || "5432"),
            database: process.env.PGDATABASE || "puja_kit_store",
            user: process.env.PGUSER || "postgres",
            password: process.env.PGPASSWORD || "",
            // Graceful connection timeout so fallback kicks in quickly
            connectionTimeoutMillis: 3000,
            idleTimeoutMillis: 10000,
            max: 10,
        });
    }
    return pool;
}

/** Run a parameterised query against PostgreSQL. */
export async function query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[]
): Promise<T[]> {
    const client = await getPool().connect();
    try {
        const res = await client.query(text, params);
        return res.rows as T[];
    } finally {
        client.release();
    }
}

/**
 * Returns true when a live PostgreSQL connection is available.
 * Used by API routes to decide whether to query the DB or fall back to
 * static data.
 */
export async function isDbConnected(): Promise<boolean> {
    // Only attempt if the env vars look configured (not the placeholder)
    if (
        !process.env.PGPASSWORD ||
        process.env.PGPASSWORD === "your_password_here"
    ) {
        return false;
    }
    try {
        await query("SELECT 1");
        return true;
    } catch {
        return false;
    }
}
