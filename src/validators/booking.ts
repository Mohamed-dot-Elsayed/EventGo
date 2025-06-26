import { z } from "zod";

export const BookingSchema = z.object({
  params: z.object({
    eventId: z.string().uuid("invalid event ID"),
  }),
});

export const cancelBookingSchema = z.object({
  params: z.object({
    bookingId: z.string().uuid("invalid event ID"),
  }),
});
