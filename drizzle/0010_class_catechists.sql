CREATE TABLE "class_catechists" (
	"class_id" integer NOT NULL,
	"catechist_id" integer NOT NULL,
	CONSTRAINT "class_catechists_class_id_catechist_id_pk" PRIMARY KEY("class_id","catechist_id")
);
--> statement-breakpoint
ALTER TABLE "catechism_classes" DROP CONSTRAINT "catechism_classes_catechist_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "class_catechists" ADD CONSTRAINT "class_catechists_class_id_catechism_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."catechism_classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_catechists" ADD CONSTRAINT "class_catechists_catechist_id_users_id_fk" FOREIGN KEY ("catechist_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Escrito à mão: leva o catequista único de cada turma para a tabela nova
-- antes de apagar a coluna antiga — ninguém perde a turma atribuída.
INSERT INTO "class_catechists" ("class_id", "catechist_id")
SELECT "id", "catechist_id" FROM "catechism_classes" WHERE "catechist_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "catechism_classes" DROP COLUMN "catechist_id";