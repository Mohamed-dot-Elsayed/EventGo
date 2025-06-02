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
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid Token");
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as JwtPayload;
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
    next();
  } catch (error) {
    throw error;
  }
}
