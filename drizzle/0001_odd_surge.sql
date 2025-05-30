ALTER TABLE "user" ADD COLUMN "name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "bio" text DEFAULT '' NOT NULL;