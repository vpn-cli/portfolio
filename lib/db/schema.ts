import { pgTable, integer, bigint } from "drizzle-orm/pg-core";

export const bytePats = pgTable("byte_pats", {
  id: integer("id").primaryKey().default(1),
  count: bigint("count", { mode: "number" }).notNull().default(0),
});

export type BytePat = typeof bytePats.$inferSelect;
