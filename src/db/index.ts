import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const globalForDb = globalThis as unknown as { client: postgres.Sql };

const client = globalForDb.client ?? postgres(process.env.DATABASE_URL, { max: 10 });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });