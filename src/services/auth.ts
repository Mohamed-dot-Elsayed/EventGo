import { db } from "../db/client";
import { User, Users } from "../db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { signUpInput } from "../validators/auth";
import { generateThumbnail, processImage } from "../utils/imageProcessor";
import path from "path";
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFound,
  UnauthorizedError,
  UniqueConstrainError,
} from "../Errors";

export const signUpWithEmail = async (
  user: signUpInput,
  file: Express.Multer.File | undefined
) => {
  try {
    const existingUser = await db.query.Users.findFirst({
      where: eq(Users.email, user.email),
    });
    if (existingUser) {
      if (existingUser.provider) {
        throw new UniqueConstrainError(
          "Email already registered with OAuth provider"
        );
      }
      throw new UniqueConstrainError("Email already registered");
    }
    if (file) {
      const { imageUrl, thumbUrl } = await handleImage(file.path);
      user.image_url = imageUrl;
      user.thumbnail_url = thumbUrl;
    }
    const salt = await bcrypt.genSalt(10);
    user.hashedpassword = await bcrypt.hash(user.password!, salt);
    const [insertedUser] = await db.insert(Users).values(user).returning();
    return insertedUser;
  } catch (error: AppError | any) {
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const user: User | undefined = await db.query.Users.findFirst({
      where: eq(Users.email, email),
    });
    if (!user) throw new UnauthorizedError("User not found with this email");
    if (!user?.hashedpassword) {
      if (user?.provider) {
        throw new UnauthorizedError(
          "This email is registered with an OAuth provider"
        );
      }
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.hashedpassword);
    if (!isValid) throw new UnauthorizedError("Invalid credentials");
    return user;
  } catch (error) {
    throw error;
  }
};

export const handleImage = async (imagePath: string) => {
  try {
    const processedPath = await processImage(imagePath);
    const imageUrl = path.join("/uploads/Images", path.basename(processedPath));

    const tnumbPath = await generateThumbnail(processedPath);
    const thumbUrl = path.join("/uploads/Thumbnails", path.basename(tnumbPath));
    return { imageUrl, thumbUrl };
  } catch (error) {
    console.error("Error handling image:", error);
    throw new ForbiddenError("Image processing failed");
  }
};
