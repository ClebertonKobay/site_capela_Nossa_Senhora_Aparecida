CREATE TABLE "pastoral_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"pastoral_id" integer NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"notes" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pastorals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pastoral_id" integer;--> statement-breakpoint
ALTER TABLE "pastoral_members" ADD CONSTRAINT "pastoral_members_pastoral_id_pastorals_id_fk" FOREIGN KEY ("pastoral_id") REFERENCES "public"."pastorals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_pastoral_id_pastorals_id_fk" FOREIGN KEY ("pastoral_id") REFERENCES "public"."pastorals"("id") ON DELETE no action ON UPDATE no action;