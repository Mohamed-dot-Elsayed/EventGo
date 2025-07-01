import { loginWithEmail, signUpWithEmail } from "../services/auth";
import { generateToken } from "../utils/auth";
import { Request, Response } from "express";
import { signUpInput } from "../validators/auth";
import { User } from "../db/schema";
import fs from "fs/promises";
import { AppError } from "../Errors";
import { SuccessResponse } from "../utils/response";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user: User = await loginWithEmail(email, password);
  const tokUSer = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  const token = generateToken(tokUSer);
  SuccessResponse(res, { token: token });
}

export async function signup(req: Request, res: Response) {
  try {
    const user1: signUpInput = req.body;
    const user: User = await signUpWithEmail(user1, req.file);
    const tokUSer = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const token = generateToken(tokUSer);
    SuccessResponse(res, { token: token }, 201);
  } catch (error: AppError | any) {
    if (req.file) await fs.unlink(req.file.path).catch(console.error);
    throw error;
  }
}
