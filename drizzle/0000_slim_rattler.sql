CREATE TABLE IF NOT EXISTS "borrow_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"lender_id" integer NOT NULL,
	"borrower_id" integer NOT NULL,
	"status" text DEFAULT 'PENDING',
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_visibility" (
	"item_id" integer,
	"community_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_src" text,
	"owner_id" integer NOT NULL,
	"holder_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "request_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"borrow_request_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"message" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"user_name" text NOT NULL,
	"email" varchar(256) NOT NULL,
	"pronouns" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'USER' NOT NULL,
	"confirm_hash" text,
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrow_requests" ADD CONSTRAINT "borrow_requests_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrow_requests" ADD CONSTRAINT "borrow_requests_lender_id_users_id_fk" FOREIGN KEY ("lender_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrow_requests" ADD CONSTRAINT "borrow_requests_borrower_id_users_id_fk" FOREIGN KEY ("borrower_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_visibility" ADD CONSTRAINT "item_visibility_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_visibility" ADD CONSTRAINT "item_visibility_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_holder_id_users_id_fk" FOREIGN KEY ("holder_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_actions" ADD CONSTRAINT "request_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
