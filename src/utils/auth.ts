import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (userId: string) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
