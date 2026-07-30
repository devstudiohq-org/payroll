ALTER TABLE "payslip_items" ADD COLUMN "base_gross" numeric(14, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "payslip_items" ADD COLUMN "additions" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "payslip_items" ADD COLUMN "custom_deductions" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "payslip_items" ADD COLUMN "custom_deductions_total" numeric(14, 2) DEFAULT '0' NOT NULL;