import { Router } from "express";
import passport from "passport";
import { db } from "../../db/client";
import { Users } from "../../db/schema";
import { generateToken } from "../../utils/auth";
import { UnauthorizedError } from "../../Errors";
import { eq } from "drizzle-orm";
import { AuthenticatedRequest } from "custom";
import "../../config/passport";

const router = Router();
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    if (!user) throw new UnauthorizedError("User not authenticated");
    if (user.role == "pending") {
      res.redirect("http://localhost:3000/pending");
    }
    // res.redirect("http://localhost:3000/api/auth/google/nny?token=" + token);
    res.json(user);
  }
);

router.get("/nny", (req, res) => {
  res.send(`hello world ${req.query.token}`);
});

router.post("/set-role", async (req, res) => {
  const { role } = req.body;
  const user = req.user;
  const [updatedUser] = await db
    .update(Users)
    .set({ role })
    .where(eq(Users.id, user!.id))
    .returning();
  if (!updatedUser) {
    throw new UnauthorizedError("User not found");
  }
  const tokUser = {
    id: updatedUser.id,
    name: updatedUser.name,
    role: updatedUser.role,
  };
  const newToken = generateToken(tokUser);
  res.json({ newToken });
});
export { router };
