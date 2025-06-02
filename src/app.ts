import express from "express";
import { router } from "./routes/auth";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFound } from "./Errors";
import { authenticated } from "./middlewares/authenticated";
import { Request, Response } from "express";
const app = express();

app.use(express.json());
app.use("/api/user", router);
app.use("/test", authenticated, (req: Request, res: Response, next) => {
  res.json({
    message: "nny",
    data: {
      user: req.user,
    },
  });
});
app.use((req, res, next) => {
  throw new NotFound("Route not found");
});
app.use(errorHandler);
app.listen(3000, () => console.log("Server running on port 3000"));
