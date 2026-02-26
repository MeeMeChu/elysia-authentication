import { type ErrorHandler } from "elysia";
import ApiError from "./api.error";
import { logger } from "@lib/logger";

export const errorHandler: ErrorHandler = ({ code, error, set }) => {
  // 🔹 Validation error (Elysia)
  if (code === "VALIDATION") {
    set.status = 400; // หรือ 422
    
    console.log("🚀 ~ errorHandler ~ error:", error)
    return {
      code: 400,
      message: "Invalid request data",
    };
  }

  // 🔹 Custom ApiError จาก service
  if (error instanceof ApiError) {
    set.status = error.statusCode;

    return {
      code: error.errorCode,
      message: error.message,
    };
  }

  // 🔹 Unknown / Programming error
  logger.error({ err: error }, "Unhandled error occurred");

  set.status = 500;
  return {
    code: 500,
    message: "Something went wrong",
  };
};
