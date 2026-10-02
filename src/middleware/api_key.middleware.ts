import Elysia from "elysia";
import ApiError from "@error/api.error";
import { customError } from "@error/custom_error/error_message";
import { env } from "@config/env";

export const apiKeyMiddleware = new Elysia({ name: "apiKey" }).derive(
  { as: "scoped" },
  ({ request }) => {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== env.API_KEY) {
      throw new ApiError(401, customError.INVALID_API_KEY);
    }

    return {};
  },
);
