import { Request, Response } from "express";
import { db } from "../db/client";
import { booking, bookings, Events } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { ConflictError, NotFound, UnauthorizedError } from "../Errors";
import {
  bookingCancelTransaction,
  bookingCreateTransaction,
  getBooking,
  getBookingsList,
} from "../services/booking";
import { SuccessResponse } from "../utils/response";

export async function createBooking(req: Request, res: Response) {
  const userId = req.user!.id;
  const eventId = req.params.eventId;
  const newBooking = await bookingCreateTransaction(userId, eventId);
  SuccessResponse(res, newBooking, 201);
}

export async function cancelBooking(req: Request, res: Response) {
  const userId = req.user!.id;
  const bookingId = req.params.bookingId;
  const canceledBooking = await bookingCancelTransaction(bookingId);
  SuccessResponse(res, canceledBooking, 200);
}

export async function getBookingsInfo(req: Request, res: Response) {
  const userId = req.user!.id;
  const status = req.query.status as string;
  const bookingsList = await getBookingsList(userId, status);
  SuccessResponse(res, bookingsList, 200);
}

export async function getBookingInfo(req: Request, res: Response) {
  const userId = req.user!.id;
  const bookingId = req.params.bookingId;
  const booking = await getBooking(bookingId, userId);
  SuccessResponse(res, booking, 200);
}
