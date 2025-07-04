import express from "express";
import type { Request, Response, NextFunction } from "express";
import { router } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFound } from "./Errors";
import { authenticated } from "./middlewares/authenticated";
import passport from "passport";
console.log("Starting server...");

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use("/api", router);

app.use((req, res, next) => {
  throw new NotFound("Route not found");
});

app.use(errorHandler);

app.listen(3000, () => console.log("Server running on port 3000"));
