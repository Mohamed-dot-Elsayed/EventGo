import { loginWithEmail, signUpWithEmail } from "../services/auth";
import { generateToken } from "../utils/auth";
import { Request, Response } from "express";
import { signUpInput } from "../validators/auth";
import { User } from "../db/schema";
import fs from "fs/promises";
import { AppError } from "../Errors";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: User = await loginWithEmail(email, password);
  const token = generateToken(user);
  res.json({ token });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const user1: signUpInput = req.body;
    const user: User = await signUpWithEmail(user1, req.file);
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error: AppError | any) {
    if (req.file) await fs.unlink(req.file.path).catch(console.error);
    throw error;
  }
};
