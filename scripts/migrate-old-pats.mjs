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

const isDryRun = process.argv.includes("--dry-run");
const databaseUrl = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL;

async function runMigration() {
  if (!databaseUrl) {
    console.log("DATABASE_URL is not set. Exiting cleanly.");
    process.exit(0);
  }

  const sql = neon(databaseUrl);

  const tableCheck = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'byte_pats';
  `;

  if (tableCheck.length === 0) {
    console.log("Nothing to migrate");
    process.exit(0);
  }

  const oldRows = await sql`SELECT count FROM byte_pats WHERE id = 1;`;
  const oldCount = Number(oldRows[0]?.count || 0);

  const totalBeforeRow = await sql`SELECT total FROM pats_total WHERE id = 1;`;
  const totalBefore = Number(totalBeforeRow[0]?.total || 0);

  console.log(`Old count (byte_pats): ${oldCount}`);
  console.log(`pats_total before migration: ${totalBefore}`);

  if (isDryRun) {
    console.log(`[DRY RUN] Would migrate ${oldCount} pats from byte_pats into pats_total and drop byte_pats.`);
    console.log(`[DRY RUN] Expected pats_total after: ${totalBefore + oldCount}`);
    process.exit(0);
  }

  // Execute INSERT/UPDATE and DROP TABLE in a single atomic transaction via Neon HTTP driver
  await sql.transaction((tx) => [
    tx`
      INSERT INTO pats_total (id, total, updated_at)
      VALUES (1, ${oldCount}, NOW())
      ON CONFLICT (id) DO UPDATE 
        SET total = pats_total.total + ${oldCount},
            updated_at = NOW();
    `,
    tx`DROP TABLE byte_pats;`,
  ]);

  const totalAfterRow = await sql`SELECT total FROM pats_total WHERE id = 1;`;
  const totalAfter = Number(totalAfterRow[0]?.total || 0);
  console.log(`pats_total after migration: ${totalAfter}`);
  console.log("Migration completed successfully.");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
