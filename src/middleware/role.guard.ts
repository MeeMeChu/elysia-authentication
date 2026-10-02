import Elysia from "elysia";
import ApiError from "@error/api.error";
import { customError } from "@error/custom_error/error_message";
import { authMiddleware, type UserPayload } from "@middleware/auth.middleware";
import type { UserRole } from "@generated/prisma/enums";

export const hasRole = (user: UserPayload, role: UserRole): boolean => user.role.includes(role);

export const hasAnyRole = (user: UserPayload, roles: readonly UserRole[]): boolean =>
  roles.some((role) => hasRole(user, role));

export const hasPermission = (permissions: readonly string[], permission: string): boolean =>
  permissions.includes(permission);

export const hasAnyPermission = (
  permissions: readonly string[],
  requiredPermissions: readonly string[],
): boolean => requiredPermissions.some((permission) => hasPermission(permissions, permission));

export const checkRole = (user: UserPayload, allowedRoles: readonly UserRole[]) => {
  if (!hasAnyRole(user, allowedRoles)) {
    throw new ApiError(403, customError.FORBIDDEN);
  }
};

// Requires at least one matching permission. An empty requirement denies access.
export const checkPermission = (
  permissions: readonly string[],
  requiredPermissions: readonly string[],
) => {
  if (!hasAnyPermission(permissions, requiredPermissions)) {
    throw new ApiError(403, customError.FORBIDDEN);
  }
};

/** Use on a controller before declaring its protected routes. */
export const roleGuard = (allowedRoles: readonly UserRole[]) =>
  new Elysia({ name: "roleGuard", seed: allowedRoles })
    .use(authMiddleware)
    .onBeforeHandle(({ user }) => checkRole(user, allowedRoles))
    .as("scoped");

export const permissionGuard = (requiredPermissions: readonly string[]) =>
  new Elysia({ name: "permissionGuard", seed: requiredPermissions })
    .use(authMiddleware)
    .onBeforeHandle(({ permissions }) => checkPermission(permissions, requiredPermissions))
    .as("scoped");

// Both a matching role AND a matching permission are required.
export const combinedGuard = (
  allowedRoles: readonly UserRole[],
  requiredPermissions: readonly string[],
) =>
  new Elysia({ name: "combinedGuard", seed: [allowedRoles, requiredPermissions] })
    .use(authMiddleware)
    .onBeforeHandle(({ user, permissions }) => {
      checkRole(user, allowedRoles);
      checkPermission(permissions, requiredPermissions);
    })
    .as("scoped");

/** All routes in a controller using this plugin require authentication.
 * Add `{ role: ["ADMIN"], permission: ["users:read"] }` to a route to restrict it further.
 */
export const accessControlMiddleware = new Elysia({ name: "accessControl" })
  .use(authMiddleware)
  .macro({
    role: (allowedRoles: readonly UserRole[]) => ({
      beforeHandle({ user }) {
        if (!user) throw new ApiError(401, customError.UNAUTHORIZED);
        checkRole(user, allowedRoles);
      },
    }),
    permission: (requiredPermissions: readonly string[]) => ({
      beforeHandle({ permissions }) {
        if (!permissions) throw new ApiError(401, customError.UNAUTHORIZED);
        checkPermission(permissions, requiredPermissions);
      },
    }),
  })
  .as("scoped");
