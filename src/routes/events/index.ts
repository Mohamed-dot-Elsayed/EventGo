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
import { authorizeRoles } from "../../middlewares/authorized";
const router = Router();
router.get("/", validate(getAllEventsSchema), getAllEvents);
router.get("/:id", validate(getEventSchema), getEvent);
router.use(authenticated);
router.use(authorizeRoles("organizer", "admin"));
router.route("/").post(validate(createEventSchema), createEvent);
router
  .route("/:id")
  .put(validate(updateEventSchema), updateEvent)
  .delete(validate(getEventSchema), deleteEvent);

export { router };
