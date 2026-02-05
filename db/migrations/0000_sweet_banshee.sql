CREATE SCHEMA "todo_app";
--> statement-breakpoint
CREATE TYPE "todo_app"."loopDuration" AS ENUM('daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "todo_app"."shareStatus" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TYPE "todo_app"."userRole" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "todo_app"."ShareID" (
	"id" serial PRIMARY KEY NOT NULL,
	"share_id" text NOT NULL,
	"list_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo_app"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo_app"."chatSession" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"history" text[] DEFAULT '{}'::text[],
	"count" integer DEFAULT 10
);
--> statement-breakpoint
CREATE TABLE "todo_app"."event" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"is_long_time" boolean DEFAULT false,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"loop" boolean DEFAULT false,
	"loop_duration" "todo_app"."loopDuration" DEFAULT 'daily',
	"end_date" timestamp,
	"creater_id" integer
);
--> statement-breakpoint
CREATE TABLE "todo_app"."finishState" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_id" integer NOT NULL,
	"finish" boolean DEFAULT false,
	CONSTRAINT "finishState_unq" UNIQUE("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "todo_app"."list" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"owner_id" text NOT NULL,
	"shareStatus" "todo_app"."shareStatus" DEFAULT 'private',
	"shareWith" integer[] DEFAULT '{}'::integer[],
	CONSTRAINT "list_unq" UNIQUE("title","owner_id")
);
--> statement-breakpoint
CREATE TABLE "todo_app"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "todo_app"."todoListLinkToEvent" (
	"id" serial PRIMARY KEY NOT NULL,
	"list_id" serial NOT NULL,
	"event_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo_app"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" "todo_app"."userRole" DEFAULT 'user',
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "todo_app"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "todo_app"."ShareID" ADD CONSTRAINT "ShareID_list_id_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "todo_app"."list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_app"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "todo_app"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_app"."chatSession" ADD CONSTRAINT "chatSession_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "todo_app"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_app"."finishState" ADD CONSTRAINT "finishState_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "todo_app"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_app"."finishState" ADD CONSTRAINT "finishState_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "todo_app"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_app"."list" ADD CONSTRAINT "list_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "todo_app"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_app"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "todo_app"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_app"."todoListLinkToEvent" ADD CONSTRAINT "todoListLinkToEvent_list_id_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "todo_app"."list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_app"."todoListLinkToEvent" ADD CONSTRAINT "todoListLinkToEvent_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "todo_app"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "todo_app"."account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "todo_app"."session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "todo_app"."verification" USING btree ("identifier");