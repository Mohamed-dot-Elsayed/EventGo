import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedRequest["user"];
    }
  }
}
