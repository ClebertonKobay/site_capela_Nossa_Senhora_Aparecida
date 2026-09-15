CREATE TABLE "catechism_attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"catechumen_id" integer NOT NULL,
	"date" date NOT NULL,
	"present" boolean NOT NULL,
	CONSTRAINT "catechism_attendance_class_id_catechumen_id_date_unique" UNIQUE("class_id","catechumen_id","date")
);
--> statement-breakpoint
CREATE TABLE "catechism_classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"catechist_id" integer,
	"weekday" integer NOT NULL,
	"time" time NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catechumens" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"name" text NOT NULL,
	"guardian_name" text,
	"guardian_phone" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catechism_attendance" ADD CONSTRAINT "catechism_attendance_class_id_catechism_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."catechism_classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_attendance" ADD CONSTRAINT "catechism_attendance_catechumen_id_catechumens_id_fk" FOREIGN KEY ("catechumen_id") REFERENCES "public"."catechumens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechism_classes" ADD CONSTRAINT "catechism_classes_catechist_id_users_id_fk" FOREIGN KEY ("catechist_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catechumens" ADD CONSTRAINT "catechumens_class_id_catechism_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."catechism_classes"("id") ON DELETE no action ON UPDATE no action;