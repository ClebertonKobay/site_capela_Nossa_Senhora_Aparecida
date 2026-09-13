ALTER TABLE "celebrations" ALTER COLUMN "celebrant" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "celebrations" ADD CONSTRAINT "celebrations_date_time_type_unique" UNIQUE("date","time","type");