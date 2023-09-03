CREATE TABLE IF NOT EXISTS "user_community_relations" (
	"user_id" integer NOT NULL,
	"community_id" integer NOT NULL,
	"role" text DEFAULT 'MEMBER'
);
--> statement-breakpoint
ALTER TABLE "item_visibility" DROP CONSTRAINT "item_visibility_community_id_community_id_fk";
--> statement-breakpoint
ALTER TABLE "community" RENAME TO "communities";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_visibility" ADD CONSTRAINT "item_visibility_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_community_relations" ADD CONSTRAINT "user_community_relations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_community_relations" ADD CONSTRAINT "user_community_relations_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
