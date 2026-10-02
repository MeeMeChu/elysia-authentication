import Elysia from "elysia";
import ApiError from "@error/api.error";
import { customError } from "@error/custom_error/error_message";
import { jwtUtils, type AccessTokenPayload } from "@lib/jwt";
import { getPermissions } from "@config/permissions";

export type UserPayload = AccessTokenPayload;

export const authMiddleware = new Elysia({ name: "auth" }).derive(
  { as: "scoped" },
  ({ request }) => {
    const authorization = request.headers.get("authorization");
    const match = authorization?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
      throw new ApiError(401, customError.UNAUTHORIZED);
    }

    const user = jwtUtils.verifyAccessToken(match[1]);
    if (!user) {
      throw new ApiError(401, customError.TOKEN_INVALID);
    }

    return { user, permissions: getPermissions(user.role) };
  },
);
