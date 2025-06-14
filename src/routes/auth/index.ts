import { Router } from "express";
import { router as localAuthRoute } from "./local";
import { router as googleAuthRoute } from "./google";
import { router as facebookAuthRoute } from "./facebook";

const router = Router();

router.use("/local", localAuthRoute);
router.use("/google", googleAuthRoute);
router.use("/facebook", facebookAuthRoute);

export { router };
