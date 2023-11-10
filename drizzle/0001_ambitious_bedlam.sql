CREATE TABLE IF NOT EXISTS "reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"expires" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
