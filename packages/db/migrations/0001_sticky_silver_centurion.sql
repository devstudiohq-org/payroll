CREATE TABLE "payroll_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"run_number" serial NOT NULL,
	"company_id" uuid NOT NULL,
	"period" text NOT NULL,
	"employees_count" integer NOT NULL,
	"total_gross_pay" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_net_pay" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_tax" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_nis" numeric(14, 2) DEFAULT '0' NOT NULL,
	"status" text DEFAULT 'Completed' NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;