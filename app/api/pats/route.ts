import { NextRequest, NextResponse } from "next/server";
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/next";
import { getDb, patsTotal, patsDailyRegion } from "@/lib/db";
import { sql, eq } from "drizzle-orm";
import { z } from "zod";
import {
  getFallbackTotal,
  incrementFallbackTotal,
  updateFallbackDailyRegion,
} from "@/lib/db/fallback-pats";

export const dynamic = "force-dynamic";

const PatBatchSchema = z.object({
  count: z.number().int().min(1).max(25),
});

// In production, if ARCJET_KEY is missing, log a warning once at startup
if (!process.env.ARCJET_KEY && process.env.NODE_ENV === "production") {
  console.warn("ARCJET_KEY is missing in production. Using local rate limiting and bot detection.");
}

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

// Local token bucket simulation (for test/local verification when ARCJET_KEY is unset or Arcjet throws)
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
    // Browsers send Origin on POST/keepalive fetch; reject missing or non-origin requests
    return false;
  }

  try {
    const parsed = new URL(origin);
    const hostname = parsed.hostname.toLowerCase();

    // localhost / 127.0.0.1 / .local only when NODE_ENV !== "production" (or when ALLOW_LOCAL_ORIGIN is explicitly set)
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local");

    if (isLocal) {
      if (process.env.ALLOW_LOCAL_ORIGIN === "true") {
        return true;
      }
      return process.env.NODE_ENV !== "production";
    }

    // Allow production domains: vipin-kaushik.vercel.app, vipinkaushik.dev, www.vipinkaushik.dev
    if (
      hostname === "vipin-kaushik.vercel.app" ||
      hostname === "vipinkaushik.dev" ||
      hostname === "www.vipinkaushik.dev"
    ) {
      return true;
    }

    // Same-host match: allow requests where origin hostname matches request Host header
    // Checked before .vercel.app so the site works when visited on its own production .vercel.app alias
    const host = req.headers.get("host")?.toLowerCase();
    if (host) {
      const cleanHost = host.split(":")[0];
      if (hostname === cleanHost) {
        return true;
      }
    }

    // For Vercel deployments, allow only this project's own deployments:
    // the hostname must equal process.env.VERCEL_PROJECT_PRODUCTION_URL,
    // process.env.VERCEL_URL, or process.env.VERCEL_BRANCH_URL (when set).
    // Remove the blanket *.vercel.app rule.
    const cleanEnvUrl = (val?: string) => {
      if (!val) return null;
      try {
        return val.replace(/^https?:\/\//, "").split("/")[0].split(":")[0].toLowerCase();
      } catch {
        return null;
      }
    };

    const vercelProductionUrl = cleanEnvUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
    if (vercelProductionUrl && hostname === vercelProductionUrl) {
      return true;
    }

    const vercelUrl = cleanEnvUrl(process.env.VERCEL_URL);
    if (vercelUrl && hostname === vercelUrl) {
      return true;
    }

    const vercelBranchUrl = cleanEnvUrl(process.env.VERCEL_BRANCH_URL);
    if (vercelBranchUrl && hostname === vercelBranchUrl) {
      return true;
    }

    if (hostname.endsWith(".vercel.app")) {
      return Boolean(
        (vercelProductionUrl && hostname === vercelProductionUrl) ||
        (vercelUrl && hostname === vercelUrl) ||
        (vercelBranchUrl && hostname === vercelBranchUrl)
      );
    }
  } catch {
    return false;
  }

  return false;
}

export async function GET() {
  const isProd = process.env.NODE_ENV === "production";
  const db = getDb();

  if (!db) {
    if (isProd) {
      console.error("DATABASE_URL missing");
      return NextResponse.json(
        { error: "unavailable" },
        { status: 503, headers: { "Retry-After": "60" } }
      );
    }
    return NextResponse.json(
      { total: getFallbackTotal() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  }

  try {
    const rows = await db
      .select({ total: patsTotal.total })
      .from(patsTotal)
      .where(eq(patsTotal.id, 1))
      .limit(1);

    const total = rows.length > 0 ? Number(rows[0].total) : 0;
    return NextResponse.json(
      { total },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  } catch (err) {
    console.error("Database query error:", err);
    if (isProd) {
      return NextResponse.json(
        { error: "unavailable" },
        { status: 503, headers: { "Retry-After": "60" } }
      );
    }
    return NextResponse.json(
      { error: "database_error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // 1. Origin header check: reject requests whose Origin isn't the site's own origin
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  // 2. Body validation with Zod: { count: integer 1..25 }
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
  let arcjetProtected = false;
  let arcjetIp: any = null;

  if (aj) {
    try {
      // Don't pass ipSrc from x-forwarded-for in production; let Arcjet detect the IP itself on Vercel.
      const protectOpts =
        process.env.NODE_ENV === "production"
          ? { requested: count }
          : { requested: count, ipSrc: clientIp };

      const decision = await aj.protect(req, protectOpts);
      arcjetProtected = true;
      arcjetIp = decision.ip;

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          const retryAfter = Math.max(1, Math.ceil(decision.reason.reset || 60));
          return NextResponse.json(
            { error: "Too many pats, slow down!" },
            { status: 429, headers: { "Retry-After": String(retryAfter) } }
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
      arcjetProtected = false;
    }
  }

  // 4. Fallback rate limiting & bot detection (when ARCJET_KEY is unset or aj.protect() threw)
  if (!arcjetProtected) {
    const ua = req.headers.get("user-agent");
    if (isKnownBotUserAgent(ua)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

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

  // 6. Atomic Database Update in One Batch
  const isProd = process.env.NODE_ENV === "production";
  const db = getDb();

  if (!db) {
    if (isProd) {
      console.error("DATABASE_URL missing");
      return NextResponse.json(
        { error: "unavailable" },
        { status: 503, headers: { "Retry-After": "60" } }
      );
    }
    const currentFallback = incrementFallbackTotal(count);
    updateFallbackDailyRegion(todayStr, country, region, city, count);
    return NextResponse.json({ total: currentFallback });
  }

  try {
    const batchResult = await db.batch([
      db
        .insert(patsTotal)
        .values({ id: 1, total: count, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: patsTotal.id,
          set: {
            total: sql`${patsTotal.total} + ${count}`,
            updatedAt: new Date(),
          },
        })
        .returning({ total: patsTotal.total }),
      db
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
        }),
    ]);

    const totalRow = batchResult[0]?.[0];
    const updatedTotal = Number(totalRow?.total ?? count);

    return NextResponse.json({ total: updatedTotal });
  } catch (err) {
    console.error("Database update batch error:", err);
    if (isProd) {
      return NextResponse.json(
        { error: "unavailable" },
        { status: 503, headers: { "Retry-After": "60" } }
      );
    }
    return NextResponse.json(
      { error: "database_error" },
      { status: 500 }
    );
  }
}
