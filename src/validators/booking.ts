import { z } from "zod";
import { bookingStatusEnum } from "../db/schema";
const bookingStatusSchema = z.enum(bookingStatusEnum.enumValues);

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

export const getAllBookingsSchema = z.object({
  query: z.object({
    status: bookingStatusSchema.optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
  }),
});
