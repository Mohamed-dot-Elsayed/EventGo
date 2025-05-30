import { loginWithEmail, signUpWithEmail } from "../services/auth";
import { generateToken } from "../utils/auth";
import { Request, Response } from "express";
import { signUpInput } from "../validators/auth";
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`${email} ${password}`);
    const user = await loginWithEmail(email, password);
    const token = generateToken(user.id);
    res.json({ token, role: user.role });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const user1: signUpInput = req.body;
    const user = await signUpWithEmail(user1);
    const token = generateToken(user[0].id);
    res.status(201).json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
