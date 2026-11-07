import { pgTable, integer, bigint, text, date, timestamp, unique } from "drizzle-orm/pg-core";

// Legacy table for backwards compatibility
export const bytePats = pgTable("byte_pats", {
  id: integer("id").primaryKey().default(1),
  count: bigint("count", { mode: "number" }).notNull().default(0),
});

// Single-row global total pats
export const patsTotal = pgTable("pats_total", {
  id: integer("id").primaryKey().default(1),
  total: bigint("total", { mode: "number" }).notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Daily pats aggregated by geographic region (privacy-preserving: no IPs or identifiers stored)
export const patsDailyRegion = pgTable(
  "pats_daily_region",
  {
    day: date("day").notNull(),
    country: text("country").notNull().default("XX"),
    region: text("region"),
    city: text("city"),
    pats: integer("pats").notNull().default(0),
    requests: integer("requests").notNull().default(0),
  },
  (table) => [
    unique("pats_daily_region_unique_idx")
      .on(table.day, table.country, table.region, table.city)
      .nullsNotDistinct(),
  ]
);

export type BytePat = typeof bytePats.$inferSelect;
export type PatsTotal = typeof patsTotal.$inferSelect;
export type PatsDailyRegion = typeof patsDailyRegion.$inferSelect;
