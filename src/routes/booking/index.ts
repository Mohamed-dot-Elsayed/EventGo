import { Router } from "express";
import { validate } from "../../middlewares/validation";
import {
  BookingSchema,
  cancelBookingSchema,
  getAllBookingsSchema,
} from "../../validators/booking";
import { catchAsync } from "../../utils/catchAsync";
import {
  cancelBooking,
  createBooking,
  getBookingInfo,
  getBookingsInfo,
} from "../../controllers/booking";
import { authenticated } from "../../middlewares/authenticated";
import { authorizeRoles } from "../../middlewares/authorized";
import { getAllEventsSchema } from "../../validators/events";

const router = Router();

router.use(authenticated).use(authorizeRoles("attendee"));
router.post(
  "/events/:eventId/booking",
  validate(BookingSchema),
  catchAsync(createBooking)
);

router
  .route("/:bookingId")
  .delete(validate(cancelBookingSchema), catchAsync(cancelBooking))
  .get(validate(cancelBookingSchema), catchAsync(getBookingInfo));

router.get("/", validate(getAllBookingsSchema), catchAsync(getBookingsInfo));
export { router };
