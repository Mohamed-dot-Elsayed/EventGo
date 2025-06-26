import { Router } from "express";
import { validate } from "../../middlewares/validation";
import { BookingSchema, cancelBookingSchema } from "../../validators/booking";
import { catchAsync } from "../../utils/catchAsync";
import { cancelBooking, createBooking } from "../../controllers/booking";
import { authenticated } from "../../middlewares/authenticated";
import { authorizeRoles } from "../../middlewares/authorized";

const router = Router();

router.use(authenticated).use(authorizeRoles("attendee"));
router.post(
  "/events/:eventId/booking",
  validate(BookingSchema),
  catchAsync(createBooking)
);

router.delete(
  "/:bookingId",
  validate(cancelBookingSchema),
  catchAsync(cancelBooking)
);

export { router };
