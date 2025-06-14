import { Router } from "express";
import { router as authRoute } from "./auth";
import { router as eventRoute } from "./events";
import { authenticated } from "../middlewares/authenticated";
const router = Router();

router.use("/auth", authRoute);
router.use("/events", eventRoute);

export { router };
