ALTER TABLE "todo_app"."event" ALTER COLUMN "creater_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo_app"."event" ALTER COLUMN "creater_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todo_app"."event" ADD CONSTRAINT "event_creater_id_user_id_fk" FOREIGN KEY ("creater_id") REFERENCES "todo_app"."user"("id") ON DELETE cascade ON UPDATE no action;