import { Events, booking, bookings } from "../db/schema";
import { db } from "../db/client";
import { and, eq } from "drizzle-orm";
import { NotFound, ConflictError } from "../Errors";

export async function bookingCreateTransaction(
  userId: string,
  eventId: string
): Promise<booking> {
  const result = await db.transaction(async (tx) => {
    const [event] = await tx
      .select()
      .from(Events)
      .where(and(eq(Events.id, eventId), eq(Events.status, "active")))
      .for("update");
    if (!event) {
      throw new NotFound("Event Not Found");
    }
    const [existingBooking] = await tx
      .select()
      .from(bookings)
      .where(and(eq(bookings.eventId, eventId), eq(bookings.userId, userId)));
    if (existingBooking) {
      if (existingBooking.status === "booked") {
        throw new ConflictError("You have already booked this event");
      } else {
        const [newBooking] = await tx
          .update(bookings)
          .set({
            status: "booked",
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, existingBooking.id))
          .returning();
        await tx
          .update(Events)
          .set({
            currentAttendees: event.currentAttendees + 1,
          })
          .where(eq(Events.id, eventId));
        return newBooking; // Return the updated booking
      }
    }
    if (event.currentAttendees >= event.maxAttendees) {
      throw new ConflictError("Event is full");
    }
    const [newBooking] = await tx
      .insert(bookings)
      .values({
        userId,
        eventId,
        status: "booked",
      })
      .returning();
    await tx
      .update(Events)
      .set({
        currentAttendees: event.currentAttendees + 1,
      })
      .where(eq(Events.id, eventId));
    return newBooking;
  });
  return result;
}

export async function bookingCancelTransaction(
  bookingId: string
): Promise<booking> {
  const result = await db.transaction(async (tx) => {
    const [booking] = await tx
      .select()
      .from(bookings)
      .innerJoin(Events, eq(bookings.eventId, Events.id))
      .where(eq(bookings.id, bookingId.trim()))
      .for("update");
    console.log("Booking found:", booking);
    console.log("BookingID found:", bookingId);

    if (!booking) {
      throw new NotFound("Booking not found");
    }
    if (booking.bookings.status !== "booked") {
      throw new ConflictError("Booking is not active");
    }
    if (new Date() > booking.events.startDate) {
      throw new ConflictError(
        "Booking cannot be canceled after the event has started"
      );
    }
    const [canceledBooking] = await tx
      .update(bookings)
      .set({
        status: "canceled",
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();
    await tx
      .update(Events)
      .set({
        currentAttendees: booking.events.currentAttendees - 1,
      })
      .where(eq(Events.id, booking.events.id));
    return canceledBooking;
  });
  return result;
}
