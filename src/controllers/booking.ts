import { Request, Response } from "express";
import { db } from "../db/client";
import { booking, bookings, Events } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { ConflictError, NotFound } from "../Errors";
import {
  bookingCancelTransaction,
  bookingCreateTransaction,
} from "../services/booking";

export async function createBooking(req: Request, res: Response) {
  const userId = req.user!.id;
  const eventId = req.params.eventId;
  const newBooking = await bookingCreateTransaction(userId, eventId);
  res.status(201).json(newBooking);
}

export async function cancelBooking(req: Request, res: Response) {
  const userId = req.user!.id;
  const bookingId = req.params.bookingId;
  const canceledBooking = await bookingCancelTransaction(bookingId);
  res.status(200).send(canceledBooking);
}
