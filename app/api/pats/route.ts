import { NextRequest, NextResponse } from "next/server";
import arcjet, { shield, slidingWindow } from "@arcjet/next";
import { getDb, bytePats } from "@/lib/db";
import { sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Initialize Arcjet if ARCJET_KEY is provided
const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        shield({ mode: "LIVE" }),
        slidingWindow({
          mode: "LIVE",
          interval: "1m",
          max: 30,
        }),
      ],
    })
  : null;

// Local fallback sliding-window rate limiter (for dev/local testing without ARCJET_KEY)
const localRateLimitMap = new Map<string, number[]>();
let fallbackCount = 0;

function checkLocalRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 30;

  const timestamps = localRateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limited
  }

  validTimestamps.push(now);
  localRateLimitMap.set(ip, validTimestamps);
  return true; // Allowed
}

export async function GET() {
  const db = getDb();
  let count = fallbackCount;

  if (db) {
    try {
      const rows = await db
        .select({ count: bytePats.count })
        .from(bytePats)
        .where(eq(bytePats.id, 1))
        .limit(1);

      if (rows.length > 0) {
        count = Number(rows[0].count);
      }
    } catch (err) {
      console.error("Error reading pats from database:", err);
    }
  }

  return NextResponse.json(
    { count },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  // 1. Rate limiting via Arcjet (if configured) or local sliding window
  if (aj) {
    try {
      const decision = await aj.protect(req);
      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return NextResponse.json(
            { error: "Too many pats, slow down!" },
            { status: 429, headers: { "Retry-After": "60" } }
          );
        }
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    } catch (err) {
      console.error("Arcjet protection error:", err);
    }
  } else {
    // Local fallback rate limit
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    if (!checkLocalRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many pats, slow down!" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // 2. Atomic database increment
  const db = getDb();
  if (db) {
    try {
      const updated = await db
        .insert(bytePats)
        .values({ id: 1, count: 1 })
        .onConflictDoUpdate({
          target: bytePats.id,
          set: { count: sql`${bytePats.count} + 1` },
        })
        .returning({ count: bytePats.count });

      const newCount = Number(updated[0]?.count ?? 1);
      return NextResponse.json({ count: newCount });
    } catch (err) {
      console.error("Database increment error:", err);
      fallbackCount += 1;
      return NextResponse.json({ count: fallbackCount });
    }
  }

  // Dev fallback when DATABASE_URL is not set
  fallbackCount += 1;
  return NextResponse.json({ count: fallbackCount });
}
