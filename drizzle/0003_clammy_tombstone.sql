ALTER TABLE "notifications" ADD COLUMN "text" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "body";