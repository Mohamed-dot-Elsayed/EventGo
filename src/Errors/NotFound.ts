import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class NotFound extends AppError {
  constructor(message = "Not Found Resource") {
    super(message, StatusCodes.NOT_FOUND);
  }
}
