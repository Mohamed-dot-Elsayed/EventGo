import { Router } from "express";
import { login, signup } from "../../controllers/auth";
import { loginSchema, signUpSchema } from "../../validators/auth";
import { validate } from "../../middlewares/validation";
import { upload } from "../../utils/image_storage";
import { catchAsync } from "../../utils/catchAsync";
const router = Router();

router.post("/login", validate(loginSchema), catchAsync(login));
router.post(
  "/signup",
  upload.single("Image"),
  validate(signUpSchema),
  catchAsync(signup)
);

export { router };
