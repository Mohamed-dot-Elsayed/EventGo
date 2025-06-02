import { userRolesEnum } from "./db/schema";
export type UserRole = (typeof userRolesEnum.enumValues)[number];

declare namespace Express {
  export interface Request {
    user?: {
      id: string | number;
      name: string;
      role: string;
    };
  }
}
