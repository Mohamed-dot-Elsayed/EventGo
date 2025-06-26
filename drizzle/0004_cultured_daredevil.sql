ALTER TABLE "events" ALTER COLUMN "max_attendees" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
-- ALTER TABLE "events" ADD COLUMN "current_attendees" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "max_attendees_positive" CHECK ("events"."max_attendees" > 0);--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "current_attendees_non_negative" CHECK ("events"."current_attendees" >= 0);