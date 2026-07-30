CREATE TABLE "tax_configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"tax_free_threshold" numeric(14, 2) DEFAULT '0' NOT NULL,
	"nis_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"nht_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"edtax_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"standard_tax_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"high_earner_threshold" numeric(14, 2) DEFAULT '0' NOT NULL,
	"high_earner_tax_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tax_configurations_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
ALTER TABLE "tax_configurations" ADD CONSTRAINT "tax_configurations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;