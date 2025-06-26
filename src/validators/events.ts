import { z } from "zod";
import { eventStatusEnum } from "../db/schema";
const eventStatusSchema = z.enum(eventStatusEnum.enumValues);
export const createEventSchema = z.object({
  body: z
    .object({
      title: z.string().min(5).max(255),
      description: z.string().min(10).max(1000),
      startDate: z.coerce
        .date()
        .min(new Date(Date.now() + 24 * 60 * 60 * 1000), {
          message: "Start date must be at least 24 hours in the future",
        }),
      endDate: z.coerce.date(),
      status: eventStatusSchema.optional().default("active"),
      location: z.string().min(3).max(255),
      maxAttendees: z.number().int().positive(),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End time must be after start time",
      path: ["endTime"],
    }),
});

export const getEventSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid event ID format"),
  }),
});

export const getAllEventsSchema = z.object({
  query: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      location: z.string().optional(),
      status: eventStatusSchema.optional(),
      organizerId: z.string().uuid("format not correct").optional(),
      sortBy: z
        .enum([
          "title",
          "startDate",
          "endDate",
          "description",
          "location",
          "status",
        ])
        .optional(),
      order: z.enum(["asc", "desc"]).optional(),
      page: z.coerce.number().int().positive().optional(),
      pageSize: z.coerce.number().int().positive().optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate)
          return data.startDate <= data.endDate;
        return true;
      },
      {
        message: "End date must be after start date",
        path: ["startDate"],
      }
    ),
});

export const updateEventSchema = z.object({
  body: createEventSchema.partial(),
  params: z.object({
    id: z.string().uuid("Invalid event ID format"),
  }),
});
export type createEventInput = z.infer<typeof createEventSchema>["body"];
export type updateEventInput = z.infer<typeof updateEventSchema>["body"];
export type getAllEventsInput = z.infer<typeof getAllEventsSchema>["query"];
