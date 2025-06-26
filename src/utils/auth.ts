import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UnauthorizedError } from "../Errors";
import { User } from "../db/schema";
dotenv.config();

export const generateToken = (user: any): string => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    return {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};
