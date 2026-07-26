CREATE TABLE "app_metadata" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"start_date" text DEFAULT '' NOT NULL,
	"role" text DEFAULT '' NOT NULL,
	"department" text DEFAULT '' NOT NULL,
	"trn" text DEFAULT '' NOT NULL,
	"nis" text DEFAULT '' NOT NULL,
	"salary" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax_code" text DEFAULT 'TC01' NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"allowances" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"deductions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
