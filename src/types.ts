import { userRolesEnum } from "./db/schema";
export type UserRole = (typeof userRolesEnum.enumValues)[number];
