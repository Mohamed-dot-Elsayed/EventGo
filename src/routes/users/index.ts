import { Router } from "express";

import {
  updateProfile,
  deleteProfile,
  getUserById,
} from "../../controllers/user";
import { authenticated } from "../../middlewares/authenticated";
const router = Router();

router
  .route("/profile")
  .get(getUserById)
  .patch(updateProfile)
  .delete(deleteProfile);

export { router };
