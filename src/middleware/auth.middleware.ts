import { Elysia } from "elysia";
import ApiError from "@error/api.error";
import { authService } from "@api/auth";

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request context
 */
export const authMiddleware = new Elysia({ name: "auth" })
  .derive(async ({ headers }) => {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required");
    }

    const token = authHeader.substring(7);

    try {
      const user = await authService.verifyAccessToken(token);
      return { user };
    } catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }
  });

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't throw error if missing
 */
export const optionalAuthMiddleware = new Elysia({ name: "optional-auth" })
  .derive(async ({ headers }) => {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null };
    }

    const token = authHeader.substring(7);

    try {
      const user = await authService.verifyAccessToken(token);
      return { user };
    } catch (error) {
      return { user: null };
    }
  });

/**
 * Role-based authorization middleware
 * Requires specific role(s) to access route
 */
export const requireRole = (...roles: string[]) =>
  new Elysia({ name: "role-guard" })
    .use(authMiddleware)
    .derive(async ({ user }: any) => {
      if (!user || !roles.includes(user.role)) {
        throw new ApiError(403, "Insufficient permissions");
      }
      return { user };
    });
