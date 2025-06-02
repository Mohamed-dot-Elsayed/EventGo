import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends AppError {
  constructor(message = "Uanauthorized Access") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
