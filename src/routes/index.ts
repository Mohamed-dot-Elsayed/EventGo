import { Router } from "express";
import { router as authRoute } from "./auth";
import { router as eventRoute } from "./events";
import { router as bookingRoute } from "./booking";
import { authenticated } from "../middlewares/authenticated";
const router = Router();

router.use("/auth", authRoute);
router.use("/events", eventRoute);
router.use("/booking", bookingRoute);

export { router };
