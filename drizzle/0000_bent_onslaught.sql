CREATE TYPE "public"."booking_status" AS ENUM('booked', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('active', 'completed', 'cancalled');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'organizer', 'attendee');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"status" "booking_status" DEFAULT 'booked' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" "event_status" DEFAULT 'active' NOT NULL,
	"location" varchar(255),
	"organizer_id" uuid NOT NULL,
	"max_attendees" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"hashedpassword" varchar(200),
	"role" "user_roles" DEFAULT 'attendee' NOT NULL,
	"provider" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_user_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_event_idx" ON "bookings" USING btree ("user_id","event_id");--> statement-breakpoint
CREATE INDEX "status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "start_date_idx" ON "events" USING btree ("start_time");--> statement-breakpoint
CREATE UNIQUE INDEX "email.idx" ON "user" USING btree ("email");