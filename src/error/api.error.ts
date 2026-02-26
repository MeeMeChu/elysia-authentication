import type { CustomErrorEntry } from "./custom_error/error_message";

class ApiError extends Error {
  statusCode: number;
  errorCode: number;
  isOperational: boolean;

  constructor(statusCode: number, entry: CustomErrorEntry, isOperational = true) {
    super(entry.message);
    this.statusCode = statusCode;
    this.errorCode = entry.code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
