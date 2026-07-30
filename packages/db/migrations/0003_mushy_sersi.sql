CREATE TABLE "payslip_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payroll_run_id" uuid NOT NULL,
	"employee_id" uuid,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"trn" text NOT NULL,
	"nis" text NOT NULL,
	"gross_pay" numeric(14, 2) DEFAULT '0' NOT NULL,
	"taxable_pay" numeric(14, 2) DEFAULT '0' NOT NULL,
	"income_tax" numeric(14, 2) DEFAULT '0' NOT NULL,
	"nis_deduction" numeric(14, 2) DEFAULT '0' NOT NULL,
	"nht_deduction" numeric(14, 2) DEFAULT '0' NOT NULL,
	"edtax_deduction" numeric(14, 2) DEFAULT '0' NOT NULL,
	"total_deductions" numeric(14, 2) DEFAULT '0' NOT NULL,
	"net_pay" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payslip_items" ADD CONSTRAINT "payslip_items_payroll_run_id_payroll_runs_id_fk" FOREIGN KEY ("payroll_run_id") REFERENCES "public"."payroll_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payslip_items" ADD CONSTRAINT "payslip_items_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;