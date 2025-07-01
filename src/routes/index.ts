import { Router } from "express";
import { router as authRoute } from "./auth";
import { router as eventRoute } from "./events";
import { router as bookingRoute } from "./booking";
import { router as profileRoute } from "./users";
const router = Router();

router.use("/auth", authRoute);
router.use("/events", eventRoute);
router.use("/booking", bookingRoute);
router.use("/profile", profileRoute);

export { router };
