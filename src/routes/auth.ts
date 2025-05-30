import { Router } from "express";
import { login, signup } from "../controllers/auth";
import { loginSchema, signUpSchema } from "../validators/auth";
import { validate } from "../middlewares/validation";
import { deleteProfile, getUserById, updateProfile } from "../controllers/user";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signUpSchema), signup);
router
  .route("profile")
  .get(getUserById)
  .delete(deleteProfile)
  .patch(updateProfile);
export { router };
