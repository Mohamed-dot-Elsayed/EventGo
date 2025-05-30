import { z } from "zod";

export const createEvent = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    startTime: z.date().min(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    endTime: z.date(),
    maxAttendees: z.number().int().positive(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const Booking = z.object({
  userId: z.string().uuid(),
  eventId: z.string().uuid(),
});
