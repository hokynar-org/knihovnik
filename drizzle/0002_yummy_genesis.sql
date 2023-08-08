CREATE TABLE IF NOT EXISTS "request_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"borrow_requests_id" integer,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"message" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_actions" ADD CONSTRAINT "request_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
