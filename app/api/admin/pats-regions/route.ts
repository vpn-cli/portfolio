import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import arcjet, { shield } from "@arcjet/next";
import { getDb, patsDailyRegion } from "@/lib/db";
import { desc } from "drizzle-orm";
import { getFallbackDailyRegions } from "@/lib/db/fallback-pats";

export const dynamic = "force-dynamic";

const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [shield({ mode: "LIVE" })],
    })
  : null;

/**
 * Validates the x-admin-key header in constant time using crypto.timingSafeEqual.
 */
function isValidAdminKey(providedKey: string | null): boolean {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || !providedKey) {
    return false;
  }

  const providedBuffer = Buffer.from(providedKey);
  const adminBuffer = Buffer.from(adminKey);

  if (providedBuffer.length !== adminBuffer.length) {
    // Constant-time dummy comparison to prevent timing leak on length
    crypto.timingSafeEqual(adminBuffer, adminBuffer);
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, adminBuffer);
}

export async function GET(req: NextRequest) {
  // Apply Arcjet shield rule
  if (aj) {
    try {
      const decision = await aj.protect(req);
      if (decision.isDenied()) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    } catch (err) {
      console.error("Arcjet shield check error:", err);
    }
  }

  const keyHeader = req.headers.get("x-admin-key");
  if (!isValidAdminKey(keyHeader)) {
    // Return 404 (not 401, don't reveal endpoint exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(patsDailyRegion)
        .orderBy(desc(patsDailyRegion.day))
        .limit(100);

      return NextResponse.json({ regions: rows });
    } catch (err) {
      console.error("Database query error in admin pats-regions:", err);
    }
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  // Fallback in-memory rows for dev/testing
  return NextResponse.json({ regions: getFallbackDailyRegions() });
}
