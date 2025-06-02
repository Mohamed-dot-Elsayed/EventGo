import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden Resource") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
