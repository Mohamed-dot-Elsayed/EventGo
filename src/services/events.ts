import { and, asc, desc, eq, gte, ilike, lte, SQL } from "drizzle-orm";
import { db } from "../db/client";
import { Events, newEvent } from "../db/schema";
import { NotFound, UnauthorizedError } from "../Errors";
import {
  createEventInput,
  getAllEventsInput,
  updateEventInput,
} from "../validators/events";

export const addEvent = async (
  eventData: createEventInput,
  userId: string | undefined
) => {
  if (!userId) {
    throw new UnauthorizedError();
  }
  eventData.startDate = new Date(eventData.startDate);
  eventData.endDate = new Date(eventData.endDate);
  const event: newEvent = {
    ...eventData,
    organizerId: userId,
  };
  console.log(eventData.startDate, typeof eventData.startDate);
  const [insertedEvent] = await db.insert(Events).values(event).returning();
  return insertedEvent;
};

export const getEventById = async (id: string) => {
  const [event] = await db
    .select()
    .from(Events)
    .where(eq(Events.id, id))
    .limit(1);
  if (!event) {
    throw new NotFound(`Event with id ${id} not found`);
  }
  return event;
};

export const getEventsFilter = async (filters: getAllEventsInput) => {
  const conditions: SQL[] = filterEvents(filters);
  let query = db
    .select()
    .from(Events)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  query = sortEvents(query, filters.sortBy, filters.order);
  query = pagination(query, Number(filters.page), Number(filters.pageSize));
  const events = await query;
  return events;
};

export const updateEventServie = async (
  eventId: string,
  userId: string,
  newData: any
) => {
  const [event] = await db
    .select()
    .from(Events)
    .where(eq(Events.id, eventId))
    .limit(1);
  if (!event) {
    throw new NotFound(`Event with id ${eventId} not found`);
  }
  isOnwer(event.organizerId, userId);
  if (newData.startDate) {
    newData.startDate = new Date(newData.startDate);
  }
  if (newData.endDate) {
    newData.endDate = new Date(newData.endDate);
  }
  const [updatedEvent] = await db
    .update(Events)
    .set({
      ...newData,
      updatedAt: new Date(),
    })
    .where(eq(Events.id, eventId))
    .returning();
  return updatedEvent;
};

export const deleteEventById = async (eventId: string, userId: string) => {
  const [event] = await db
    .select()
    .from(Events)
    .where(eq(Events.id, eventId))
    .limit(1);
  if (!event) {
    throw new NotFound(`Event with id ${eventId} not found`);
  }
  isOnwer(event.organizerId, userId);
  const [deletedEvent] = await db
    .delete(Events)
    .where(eq(Events.id, eventId))
    .returning();
  return deletedEvent;
};

const filterEvents = (filters: any): SQL[] => {
  const conditions: SQL[] = [];
  if (filters.title) {
    conditions.push(ilike(Events.title, `%${filters.title}%`));
  }
  if (filters.description) {
    conditions.push(ilike(Events.description, `%${filters.description}%`));
  }
  if (filters.startDate) {
    conditions.push(gte(Events.startDate, filters.startDate));
  }
  if (filters.endDate) {
    conditions.push(lte(Events.endDate, filters.endDate));
  }
  if (filters.location) {
    conditions.push(ilike(Events.location, `%${filters.location}%`));
  }
  if (filters.status) {
    conditions.push(eq(Events.status, filters.status));
  }
  if (filters.organizerId) {
    conditions.push(eq(Events.organizerId, filters.organizerId));
  }
  return conditions;
};

const pagination = (query: any, page: number, pageSize: number) => {
  page = page || 1;
  pageSize = pageSize || 1;
  const offset = (page - 1) * pageSize;
  return query.limit(pageSize).offset(offset);
};

const sortEvents = (
  query: any,
  sortBy: string | undefined,
  order: "asc" | "desc" = "asc"
) => {
  const sortableColumns = {
    title: Events.title,
    startDate: Events.startDate,
    endDate: Events.endDate,
    location: Events.location,
    describtion: Events.description,
    status: Events.status,
  };
  const column = sortableColumns[sortBy as keyof typeof sortableColumns];
  if (!column) return query;
  return query.orderBy(order === "asc" ? asc(column) : desc(column));
};

const isOnwer = (userId: string, eventId: string) => {
  if (eventId !== userId) {
    throw new UnauthorizedError(
      "You are not authorized to perform this action on this event"
    );
  }
};
