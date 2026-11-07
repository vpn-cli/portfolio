export interface FallbackRegionRow {
  day: string;
  country: string;
  region: string | null;
  city: string | null;
  pats: number;
  requests: number;
}

export let fallbackTotal = 0;
export const fallbackRegionMap = new Map<string, FallbackRegionRow>();

function assertNotProduction(op: string) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(`In-memory fallback (${op}) is forbidden in production`);
  }
}

export function getFallbackTotal(): number {
  assertNotProduction("getFallbackTotal");
  return fallbackTotal;
}

export function incrementFallbackTotal(count: number): number {
  assertNotProduction("incrementFallbackTotal");
  fallbackTotal += count;
  return fallbackTotal;
}

export function updateFallbackDailyRegion(
  day: string,
  country: string,
  region: string | null,
  city: string | null,
  pats: number
) {
  assertNotProduction("updateFallbackDailyRegion");
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

export function getFallbackDailyRegions(): FallbackRegionRow[] {
  assertNotProduction("getFallbackDailyRegions");
  return Array.from(fallbackRegionMap.values());
}
