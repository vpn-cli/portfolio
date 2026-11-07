import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// Try loading DATABASE_URL from .env or .env.local if not already in environment
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  }
}

loadEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("Note: DATABASE_URL environment variable is not set. Skipping DB migration.");
  process.exit(0);
}

async function setup() {
  console.log("Connecting to Neon Postgres...");
  const sql = neon(databaseUrl);

  console.log("Creating tables for Byte pats...");

  // 1. pats_total
  await sql`
    CREATE TABLE IF NOT EXISTS pats_total (
      id INT PRIMARY KEY DEFAULT 1,
      total BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  // 2. pats_daily_region
  await sql`
    CREATE TABLE IF NOT EXISTS pats_daily_region (
      day DATE NOT NULL,
      country TEXT NOT NULL DEFAULT 'XX',
      region TEXT,
      city TEXT,
      pats INT NOT NULL DEFAULT 0,
      requests INT NOT NULL DEFAULT 0,
      CONSTRAINT pats_daily_region_unique_idx UNIQUE NULLS NOT DISTINCT(day, country, region, city)
    );
  `;

  // 3. Seed initial row with total 0
  await sql`
    INSERT INTO pats_total (id, total, updated_at)
    VALUES (1, 0, NOW())
    ON CONFLICT (id) DO NOTHING;
  `;

  const rows = await sql`SELECT id, total, updated_at FROM pats_total WHERE id = 1;`;
  console.log("Success! Current pats_total row:", rows[0]);
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
