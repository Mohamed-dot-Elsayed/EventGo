import { verifyToken } from "../utils/auth";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../Errors";

interface JwtPayload {
  id: string;
  name: string;
  role: string;
  [key: string]: any;
}

export function authenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalid Token");
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  req.user = decoded;
  next();
}
