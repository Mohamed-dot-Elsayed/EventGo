import { userRolesEnum } from "./db/schema";
export type UserRole = (typeof userRolesEnum.enumValues)[number];

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}
