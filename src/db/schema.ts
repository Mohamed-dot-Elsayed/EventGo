import {
  pgTable,
  text,
  timestamp,
  integer,
  varchar,
  check,
  pgEnum,
  uniqueIndex,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const userRolesEnum = pgEnum("user_roles", [
  "admin",
  "organizer",
  "attendee",
]);
export const eventStatusEnum = pgEnum("event_status", [
  "active",
  "completed",
  "cancalled",
]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "booked",
  "canceled",
]);

export const Users = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    hashedpassword: varchar("hashedpassword", { length: 200 }),
    role: userRolesEnum("role").notNull().default("attendee"),
    name: varchar("name", { length: 50 }).notNull(),
    bio: text("bio").notNull().default(""),
    image_url: text("image_url"),
    thumbnail_url: text("thumbnail_url"),
    provider: varchar("provider", { length: 100 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (users) => [uniqueIndex("email.idx").on(users.email)]
);

export const Events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    startDate: timestamp("start_time").notNull(),
    endDate: timestamp("end_time").notNull(),
    status: eventStatusEnum("status").notNull().default("active"),
    location: varchar("location", { length: 255 }),
    organizerId: uuid("organizer_id")
      .notNull()
      .references(() => Users.id),
    maxAttendees: integer("max_attendees").notNull(),
    currentAttendees: integer("current_attendees").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (events) => [
    index("status_idx").on(events.status),
    index("start_date_idx").on(events.startDate),
    check("max_attendees_positive", sql`${events.maxAttendees} > 0`),
    check(
      "current_attendees_non_negative",
      sql`${events.currentAttendees} >= 0`
    ),
  ]
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => Users.id),
    eventId: uuid("event_id")
      .notNull()
      .references(() => Events.id),
    status: bookingStatusEnum("status").notNull().default("booked"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (bookings) => [
    uniqueIndex("user_event_idx").on(bookings.userId, bookings.eventId),
  ]
);

export type User = typeof Users.$inferSelect;
export type newUser = typeof Users.$inferInsert;
export type Event = typeof Events.$inferSelect;
export type newEvent = typeof Events.$inferInsert;
export type booking = typeof bookings.$inferSelect;
export type newBooking = typeof bookings.$inferInsert;
