import { NextRequest, NextResponse } from "next/server";
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/next";
import { getDb, patsTotal, patsDailyRegion } from "@/lib/db";
import { sql, eq, desc } from "drizzle-orm";
import { z } from "zod";

export const dynamic = "force-dynamic";

const PatBatchSchema = z.object({
  count: z.number().int().min(1).max(25),
});

// Initialize Arcjet with exact 4 rules in order:
// 1. shield (LIVE)
// 2. detectBot (deny all automated clients, no allow-list)
// 3. tokenBucket per client IP (capacity 120, refill 60 per 60s, requested = count)
// 4. daily cap (capacity 600, refill 600 per 1d, requested = count)
const aj = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        shield({ mode: "LIVE" }),
        detectBot({
          mode: "LIVE",
          allow: [], // Deny all automated clients
        }),
        tokenBucket({
          mode: "LIVE",
          capacity: 120,
          refillRate: 60,
          interval: "60s",
        }),
        tokenBucket({
          mode: "LIVE",
          capacity: 600,
          refillRate: 600,
          interval: "1d",
        }),
      ],
    })
  : null;

// Fallback in-memory state for local testing or dev without DATABASE_URL / ARCJET_KEY
let fallbackTotal = 0;
export interface FallbackRegionRow {
  day: string;
  country: string;
  region: string | null;
  city: string | null;
  pats: number;
  requests: number;
}
const fallbackRegionMap = new Map<string, FallbackRegionRow>();

function updateFallbackDailyRegion(
  day: string,
  country: string,
  region: string | null,
  city: string | null,
  pats: number
) {
  const key = `${day}|${country}|${region ?? ""}|${city ?? ""}`;
  const existing = fallbackRegionMap.get(key);
  if (existing) {
    existing.pats += pats;
    existing.requests += 1;
  } else {
    fallbackRegionMap.set(key, {
      day,
      country,
      region,
      city,
      pats,
      requests: 1,
    });
  }
}

// Local token bucket simulation (for test/local verification when ARCJET_KEY is unset)
interface LocalLimitState {
  tokens: number;
  lastRefill: number;
  dailyPats: number;
  dayStart: number;
}
const localLimits = new Map<string, LocalLimitState>();

function checkLocalRateLimit(ip: string, count: number): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const dayMs = 86400000;
  let state = localLimits.get(ip);

  if (!state) {
    state = {
      tokens: 120,
      lastRefill: now,
      dailyPats: 0,
      dayStart: now,
    };
    localLimits.set(ip, state);
  }

  // Daily reset
  if (now - state.dayStart >= dayMs) {
    state.dailyPats = 0;
    state.dayStart = now;
  }

  // Daily cap: 600 pats per IP per day
  if (state.dailyPats + count > 600) {
    const remainingDaySec = Math.ceil((dayMs - (now - state.dayStart)) / 1000);
    return { allowed: false, retryAfter: Math.max(60, remainingDaySec) };
  }

  // Refill 60 tokens per 60s (1 token per second, capacity 120)
  const elapsed = now - state.lastRefill;
  const tokensToAdd = (elapsed / 60000) * 60;
  state.tokens = Math.min(120, state.tokens + tokensToAdd);
  state.lastRefill = now;

  if (state.tokens < count) {
    const deficit = count - state.tokens;
    const retrySec = Math.ceil((deficit / 60) * 60);
    return { allowed: false, retryAfter: Math.max(1, retrySec) };
  }

  state.tokens -= count;
  state.dailyPats += count;
  return { allowed: true };
}

function isKnownBotUserAgent(ua: string | null): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return (
    lower.includes("curl") ||
    lower.includes("wget") ||
    lower.includes("python-requests") ||
    lower.includes("bot") ||
    lower.includes("spider") ||
    lower.includes("crawler")
  );
}

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) {
    // Browsers send Origin on POST/Beacon; reject missing or non-origin requests
    return false;
  }

  try {
    const parsed = new URL(origin);
    const hostname = parsed.hostname.toLowerCase();

    // Allow localhost and loopbacks in dev/testing
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local")
    ) {
      return true;
    }

    // Match current host header
    const host = req.headers.get("host")?.toLowerCase();
    if (host) {
      const cleanHost = host.split(":")[0];
      if (hostname === cleanHost) {
        return true;
      }
    }

    // Known site production origins
    if (hostname === "vipinkaushik.dev" || hostname.endsWith(".vipinkaushik.dev")) {
      return true;
    }
    if (hostname.endsWith(".vercel.app")) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function GET(req: NextRequest) {
  // Support region rows query for inspection and verification
  if (req.nextUrl.searchParams.get("regions") === "true") {
    const db = getDb();
    if (db) {
      try {
        const rows = await db
          .select()
          .from(patsDailyRegion)
          .orderBy(desc(patsDailyRegion.day))
          .limit(50);
        return NextResponse.json({ regions: rows });
      } catch (err) {
        console.error("Error reading regions from database:", err);
      }
    }
    return NextResponse.json({ regions: Array.from(fallbackRegionMap.values()) });
  }

  const db = getDb();
  let total = fallbackTotal;

  if (db) {
    try {
      const rows = await db
        .select({ total: patsTotal.total })
        .from(patsTotal)
        .where(eq(patsTotal.id, 1))
        .limit(1);

      if (rows.length > 0) {
        total = Number(rows[0].total);
      }
    } catch (err) {
      console.error("Error reading pats from database:", err);
    }
  }

  return NextResponse.json(
    { total },
    {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  // 1. Origin header check: reject requests whose Origin isn't the site's own origin
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  // 2. Bot check fallback (reject automated clients early)
  const ua = req.headers.get("user-agent");
  if (!aj && isKnownBotUserAgent(ua)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // 3. Body validation with Zod: { count: integer 1..25 }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = PatBatchSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid count: must be integer between 1 and 25" },
      { status: 400 }
    );
  }
  const { count } = parseResult.data;

  // Resolve client IP
  const forwarded = req.headers.get("x-forwarded-for");
  const clientIp = forwarded
    ? forwarded.split(",")[0].trim()
    : req.headers.get("x-real-ip") || "127.0.0.1";

  // 3. Arcjet protection (if configured)
  let arcjetIp: any = null;

  if (aj) {
    try {
      const decision = await aj.protect(req, { requested: count, ipSrc: clientIp });
      arcjetIp = decision.ip;

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return NextResponse.json(
            { error: "Too many pats, slow down!" },
            { status: 429, headers: { "Retry-After": "60" } }
          );
        }
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      // Reject requests from hosting/datacenter IPs if detected by Arcjet
      if (decision.ip && typeof decision.ip.isHosting === "function" && decision.ip.isHosting()) {
        return NextResponse.json(
          { error: "Access denied from hosting provider" },
          { status: 403 }
        );
      }
    } catch (err) {
      console.error("Arcjet protection error:", err);
    }
  }

  // 4. Fallback Rate Limiting (when ARCJET_KEY is unset or locally testing)
  if (!aj) {
    const rateResult = checkLocalRateLimit(clientIp, count);
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: "Too many pats, slow down!" },
        { status: 429, headers: { "Retry-After": String(rateResult.retryAfter || 60) } }
      );
    }
  }

  // 5. Location resolution (Arcjet decision.ip > Platform geo headers > "XX")
  let country = "XX";
  let region: string | null = null;
  let city: string | null = null;

  if (arcjetIp) {
    if (arcjetIp.country && arcjetIp.country.trim()) {
      country = arcjetIp.country.trim().toUpperCase();
    }
    if (arcjetIp.region && arcjetIp.region.trim()) {
      region = arcjetIp.region.trim();
    }
    if (arcjetIp.city && arcjetIp.city.trim()) {
      city = arcjetIp.city.trim();
    }
  }

  if (country === "XX") {
    const headerCountry =
      req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");
    if (headerCountry && headerCountry.trim()) {
      country = headerCountry.trim().toUpperCase();
    }
  }

  if (!region) {
    const headerRegion =
      req.headers.get("x-vercel-ip-country-region") || req.headers.get("cf-region-code");
    if (headerRegion && headerRegion.trim()) {
      region = headerRegion.trim();
    }
  }

  if (!city) {
    const headerCity =
      req.headers.get("x-vercel-ip-city") || req.headers.get("cf-ipcity");
    if (headerCity && headerCity.trim()) {
      try {
        city = decodeURIComponent(headerCity.trim());
      } catch {
        city = headerCity.trim();
      }
    }
  }

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 6. Atomic Database Update in One Transaction
  const db = getDb();
  if (db) {
    try {
      const updatedTotal = await db.transaction(async (tx) => {
        const [totalRow] = await tx
          .insert(patsTotal)
          .values({ id: 1, total: count, updatedAt: new Date() })
          .onConflictDoUpdate({
            target: patsTotal.id,
            set: {
              total: sql`${patsTotal.total} + ${count}`,
              updatedAt: new Date(),
            },
          })
          .returning({ total: patsTotal.total });

        await tx
          .insert(patsDailyRegion)
          .values({
            day: todayStr,
            country,
            region,
            city,
            pats: count,
            requests: 1,
          })
          .onConflictDoUpdate({
            target: [
              patsDailyRegion.day,
              patsDailyRegion.country,
              patsDailyRegion.region,
              patsDailyRegion.city,
            ],
            set: {
              pats: sql`${patsDailyRegion.pats} + ${count}`,
              requests: sql`${patsDailyRegion.requests} + 1`,
            },
          });

        return Number(totalRow?.total ?? count);
      });

      return NextResponse.json({ total: updatedTotal });
    } catch (err) {
      console.error("Database update transaction error:", err);
      // Fallback in-memory persistence
      fallbackTotal += count;
      updateFallbackDailyRegion(todayStr, country, region, city, count);
      return NextResponse.json({ total: fallbackTotal });
    }
  }

  // Dev in-memory fallback when DATABASE_URL is not set
  fallbackTotal += count;
  updateFallbackDailyRegion(todayStr, country, region, city, count);
  return NextResponse.json({ total: fallbackTotal });
}
