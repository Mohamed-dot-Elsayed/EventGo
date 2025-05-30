import { db } from "../db/client";
import { Users } from "../db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { UserRole } from "../types";
import { signUpInput } from "../validators/auth";
export const signUpWithEmail = async (user: signUpInput) => {
  const existingUser = await db.query.Users.findFirst({
    where: eq(Users.email, user.email),
  });
  if (existingUser) {
    if (existingUser.provider) {
      throw new Error("Email already registered with OAuth provider");
    }
    throw new Error("Email already registered");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(user.password!, salt);
  return db.insert(Users).values(user).returning();
};

export const loginWithEmail = async (email: string, password: string) => {
  const user = await db.query.Users.findFirst({
    where: eq(Users.email, email),
    columns: {
      id: true,
      hashedpassword: true,
      role: true,
      provider: true,
    },
  });

  if (!user?.hashedpassword) {
    if (user?.provider) {
      throw new Error("This email is registered with an OAuth provider");
    }
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.hashedpassword);
  if (!isValid) throw new Error("Invalid credentials");
  return {
    id: user.id,
    role: user.role,
  };
};
