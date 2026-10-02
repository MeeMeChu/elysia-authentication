import Elysia, { type ErrorHandler } from "elysia";
import ApiError from "./api.error";
import { customError } from "./custom_error/error_message";
import { logger } from "@lib/logger";

export const errorHandler: ErrorHandler = ({ code, error, set }) => {
  if (error instanceof ApiError && error.isOperational) {
    set.status = error.statusCode;
    return { code: error.errorCode, message: error.message };
  }

  if (code === "VALIDATION") {
    set.status = 400;
    return { ...customError.VALIDATION_ERROR };
  }

  if (code === "PARSE") {
    set.status = 400;
    return { ...customError.BAD_REQUEST };
  }

  if (code === "NOT_FOUND") {
    set.status = 404;
    return { ...customError.NOT_FOUND };
  }

  logger.error({ err: error }, "Unhandled error occurred");
  set.status = 500;
  return { ...customError.INTERNAL_SERVER_ERROR };
};

export const errorMiddleware = new Elysia({ name: "errorHandler" }).onError(
  { as: "global" },
  errorHandler,
);
