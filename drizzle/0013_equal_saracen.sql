ALTER TABLE "communities" ADD COLUMN "visibility" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "community_messages" DROP COLUMN IF EXISTS "visibility";