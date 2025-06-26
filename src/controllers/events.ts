import { Request, Response } from "express";
import {
  addEvent,
  deleteEventById,
  getEventById,
  getEventsFilter,
  updateEventServie,
} from "../services/events";
import { createEventInput, getAllEventsInput } from "../validators/events";
import { Event } from "../db/schema";

export async function getAllEvents(req: Request, res: Response) {
  const filters: getAllEventsInput = req.query;
  const events: Event[] = await getEventsFilter(filters);
  res.status(200).json(events);
}
export async function getEvent(req: Request, res: Response) {
  const id = req.params.id;
  const event: Event = await getEventById(id);
  res.status(200).json({ data: event });
}
export async function createEvent(req: Request, res: Response) {
  const id = req.user?.id;
  const eventData: createEventInput = req.body;
  const event: Event = await addEvent(eventData, id);
  res.status(201).json(event);
}
export async function updateEvent(req: Request, res: Response) {
  console.log("in controll  start");

  const evntId = req.params.id;
  const userId = req.user!.id;
  const event: Event = await updateEventServie(evntId, userId, req.body);
  res.status(200).json(event);
}
export async function deleteEvent(req: Request, res: Response) {
  const evntId = req.params.id;
  const userId = req.user!.id;
  const event: Event = await deleteEventById(evntId, userId);
  res.status(200).json(event);
}
