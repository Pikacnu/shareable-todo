ALTER TABLE "todo_app"."list" ALTER COLUMN "shareWith" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "todo_app"."list" ALTER COLUMN "shareWith" SET DEFAULT '{}'::text[];