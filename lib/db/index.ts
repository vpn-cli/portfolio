import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let sqlClient: NeonQueryFunction<false, false> | null = null;
let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  if (!dbInstance) {
    sqlClient = neon(databaseUrl);
    dbInstance = drizzle(sqlClient, { schema });
  }

  return dbInstance;
}

export * from "./schema";
