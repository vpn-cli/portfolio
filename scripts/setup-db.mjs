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
  console.error("Error: DATABASE_URL environment variable is missing.");
  console.error("Please set DATABASE_URL=postgresql://... in your environment or .env.local file.");
  process.exit(1);
}

async function setup() {
  console.log("Connecting to Neon Postgres...");
  const sql = neon(databaseUrl);

  console.log("Creating byte_pats table if not exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS byte_pats (
      id INT PRIMARY KEY DEFAULT 1,
      count BIGINT NOT NULL DEFAULT 0
    );
  `;

  console.log("Seeding initial row with id=1...");
  await sql`
    INSERT INTO byte_pats (id, count)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING;
  `;

  const rows = await sql`SELECT id, count FROM byte_pats WHERE id = 1;`;
  console.log("Success! Current byte_pats row:", rows[0]);
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
