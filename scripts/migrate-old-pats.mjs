import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

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

async function runMigration() {
  if (!databaseUrl) {
    console.log("DATABASE_URL is not set. Cannot connect to database.");
    return;
  }

  const sql = neon(databaseUrl);

  console.log("Checking if byte_pats table exists in database...");
  const tableCheck = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'byte_pats';
  `;

  if (tableCheck.length === 0) {
    console.log("Table 'byte_pats' does not exist in the database.");
    const totalRow = await sql`SELECT total FROM pats_total WHERE id = 1;`;
    console.log("Current pats_total:", totalRow[0]?.total ?? 0);
    return;
  }

  const oldRows = await sql`SELECT count FROM byte_pats WHERE id = 1;`;
  const oldCount = Number(oldRows[0]?.count || 0);
  console.log(`[Before Migration] byte_pats count: ${oldCount}`);

  const totalBeforeRow = await sql`SELECT total FROM pats_total WHERE id = 1;`;
  const totalBefore = Number(totalBeforeRow[0]?.total || 0);
  console.log(`[Before Migration] pats_total: ${totalBefore}`);

  // Perform migration in a transaction
  await sql`
    INSERT INTO pats_total (id, total, updated_at)
    VALUES (1, ${oldCount}, NOW())
    ON CONFLICT (id) DO UPDATE 
      SET total = pats_total.total + ${oldCount},
          updated_at = NOW();
  `;

  await sql`DROP TABLE byte_pats;`;

  const totalAfterRow = await sql`SELECT total FROM pats_total WHERE id = 1;`;
  const totalAfter = Number(totalAfterRow[0]?.total || 0);
  console.log(`[After Migration] pats_total: ${totalAfter}`);
  console.log("Successfully migrated count from byte_pats into pats_total and dropped byte_pats!");
}

runMigration().catch(console.error);
