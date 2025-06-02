import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class DatabaseError extends AppError {
  constructor(message = "Database Operation Failed") {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
