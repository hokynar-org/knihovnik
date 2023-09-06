CREATE TABLE IF NOT EXISTS "community_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"message" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "community_meassages";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_messages" ADD CONSTRAINT "community_messages_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_messages" ADD CONSTRAINT "community_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
