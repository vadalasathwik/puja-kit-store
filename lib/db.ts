import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
            connectionTimeoutMillis: 3000,
            idleTimeoutMillis: 10000,
            max: 10,
        });
    }
    return pool;
}

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

export async function isDbConnected(): Promise<boolean> {
    if (!process.env.DATABASE_URL) {
        return false;
    }

    try {
        await query("SELECT 1");
        return true;
    } catch {
        return false;
    }
}