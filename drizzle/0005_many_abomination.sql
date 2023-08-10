ALTER TABLE "notifications" DROP CONSTRAINT "notifications_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" RENAME COLUMN "item_id" TO "user_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
