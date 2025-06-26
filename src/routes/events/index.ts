import { Router } from "express";
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../controllers/events";
import { authenticated } from "../../middlewares/authenticated";
import { validate } from "../../middlewares/validation";
import {
  createEventSchema,
  getAllEventsSchema,
  getEventSchema,
  updateEventSchema,
} from "../../validators/events";
import { catchAsync } from "../../utils/catchAsync";
import { authorizeRoles } from "../../middlewares/authorized";
const router = Router();
router.get("/", validate(getAllEventsSchema), catchAsync(getAllEvents));
router.get("/:id", validate(getEventSchema), catchAsync(getEvent));
router.use(authenticated);
router.use(authorizeRoles("organizer", "admin"));
router.route("/").post(validate(createEventSchema), catchAsync(createEvent));
router
  .route("/:id")
  .put(validate(updateEventSchema), catchAsync(updateEvent))
  .delete(validate(getEventSchema), catchAsync(deleteEvent));

export { router };
