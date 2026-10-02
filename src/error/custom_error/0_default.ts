import type { CustomErrorEntry } from "./error_message";

// Default/Internal application error codes: 0000–0099 (separate from HTTP status).
export const defaultError = {
  INTERNAL_ERROR: (message: string): CustomErrorEntry => ({
    code: "0000",
    message,
  }),
  INVALID_SORT_FIELD: (field: string) => ({
    code: "0001",
    message: `Invalid sort field: ${field}`,
  }),
  BAD_REQUEST: { code: "0002", message: "Bad request" },
  VALIDATION_ERROR: { code: "0003", message: "Invalid request data" },
  FORBIDDEN: { code: "0004", message: "Forbidden" },
  NOT_FOUND: { code: "0005", message: "Resource not found" },
  CONFLICT: { code: "0006", message: "Resource already exists" },
  TOO_MANY_REQUESTS: { code: "0007", message: "Too many requests" },
  INTERNAL_SERVER_ERROR: { code: "0008", message: "Something went wrong" },
  SERVICE_UNAVAILABLE: { code: "0009", message: "Service unavailable" },
} as const;

export type DefaultErrorKey = keyof typeof defaultError;
export type DefaultErrorEntry = (typeof defaultError)[DefaultErrorKey];
