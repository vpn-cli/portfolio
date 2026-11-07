CREATE TABLE "byte_pats" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"count" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pats_daily_region" (
	"day" date NOT NULL,
	"country" text DEFAULT 'XX' NOT NULL,
	"region" text,
	"city" text,
	"pats" integer DEFAULT 0 NOT NULL,
	"requests" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "pats_daily_region_unique_idx" UNIQUE NULLS NOT DISTINCT("day","country","region","city")
);
--> statement-breakpoint
CREATE TABLE "pats_total" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"total" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
