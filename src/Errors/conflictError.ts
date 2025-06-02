import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class ConflictError extends AppError {
  constructor(message = "Resource Conflict") {
    super(message, StatusCodes.CONFLICT);
  }
}
