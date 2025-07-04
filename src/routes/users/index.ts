import { Router } from "express";

import {
  updateProfile,
  deleteProfile,
  getUserById,
} from "../../controllers/user";
import { authenticated } from "../../middlewares/authenticated";
const router = Router();

router.route("/").get(getUserById).patch(updateProfile).delete(deleteProfile);

export { router };
