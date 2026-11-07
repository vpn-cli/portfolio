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

function printUsageAndExit(errorMessage) {
  if (errorMessage) {
    console.error(errorMessage);
  }
  console.error("Usage: node scripts/migrate-old-pats.mjs --target=prod|test [--dry-run] [--yes]");
  console.error("  --target=prod  Uses DATABASE_URL");
  console.error("  --target=test  Uses DATABASE_URL_TEST");
  console.error("  --dry-run      Simulate migration without modifying data");
  console.error("  --yes          Apply migration changes (required when not in --dry-run mode)");
  process.exit(1);
}

const targetArg = process.argv.find((arg) => arg.startsWith("--target="));
const target = targetArg ? targetArg.split("=")[1]?.trim() : null;

if (!target || (target !== "prod" && target !== "test")) {
  printUsageAndExit("Error: --target=prod or --target=test flag is required.");
}

const envVarName = target === "prod" ? "DATABASE_URL" : "DATABASE_URL_TEST";
const databaseUrl = process.env[envVarName];

if (!databaseUrl) {
  printUsageAndExit(`Error: Environment variable ${envVarName} is not set.`);
}

let dbHost = "";
try {
  const parsed = new URL(databaseUrl);
  dbHost = parsed.hostname;
} catch {
  printUsageAndExit(`Error: Could not parse ${envVarName} as a valid URL.`);
}

console.log(`Target: ${target} (${dbHost})`);

const isDryRun = process.argv.includes("--dry-run");
const isYes = process.argv.includes("--yes");

async function runMigration() {
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
  console.log(`[DRY RUN] Would migrate ${oldCount} pats from byte_pats into pats_total and drop byte_pats.`);
  console.log(`[DRY RUN] Expected pats_total after: ${totalBefore + oldCount}`);

  if (isDryRun) {
    process.exit(0);
  }

  if (!isYes) {
    console.log("Add --yes to apply");
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
