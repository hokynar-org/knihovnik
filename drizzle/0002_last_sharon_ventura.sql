ALTER TABLE "notifications" ADD COLUMN "body" json;--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "action_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "message";