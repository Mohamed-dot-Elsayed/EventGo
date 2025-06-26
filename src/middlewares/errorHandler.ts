import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../Errors";
import { StatusCodes } from "http-status-codes";
import { PostgresError } from "postgres";
import Jwt from "jsonwebtoken";

interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
  errors?: any[];
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let errors: any[] | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    errors = (err as any).errors.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  } else if (err instanceof PostgresError) {
    statusCode = 400;
    message = "Database error";

    switch (err.code) {
      case "23505":
        statusCode = 409;
        message = "Duplicate value violates unique constraint";
        errors = [
          {
            field: extractConstraintField(err, "unique"),
            message: "Value must be unique",
          },
        ];
        break;
      case "23503":
        statusCode = 400;
        message = "Foreign key constraint violation";
        errors = [
          {
            field: extractConstraintField(err, "foreign"),
            message: "Invalid reference value",
          },
        ];
        break;
      case "23502":
        statusCode = 400;
        message = "Missing required field";
        errors = [
          {
            field: extractConstraintField(err, "unique"),
            message: "This field is required",
          },
        ];
        break;
      case "22P02":
        statusCode = 400;
        message = "Invalid data format";
        break;
      default:
        console.error(`PostgreSQL Error [${err.code}]: `, err.message);
    }
  } else if (err instanceof Jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid token";
  } else if (err instanceof Jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Token expired";
  }

  const response: ErrorResponse = {
    status: statusCode >= 500 ? "error" : "fail",
    message,
  };

  if (errors) response.errors = errors;

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ${err.stack || err}`);
  }
  res.status(statusCode).json(response);
};

function extractConstraintField(err: PostgresError, type: string): string {
  if (type == "unique") {
    const match = /Key \((.+?)\)=/.exec(err.detail || "");
    return match ? match[1] : "unknown";
  }
  if (type == "foreign") {
    const match = /Key \((.+?)\)=/.exec(err.detail || "");
    return match ? match[1] : "unknown";
  }
  if (type == "not_null") {
    const match = /column "(.+?)" of relation /.exec(err.message);
    return match ? match[1] : "unknown";
  }
  return "unknown";
}
