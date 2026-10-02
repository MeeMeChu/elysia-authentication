import type { UserRole } from "@generated/prisma/enums";

// Add your application's permissions here, e.g. ADMIN: ["users:read"].
// No role receives permissions implicitly, including SUPERADMIN.
export const rolePermissions: Record<UserRole, readonly string[]> = {
  USER: [],
  ADMIN: [],
  SUPERADMIN: [],
};

export const getPermissions = (roles: readonly UserRole[]): string[] => [
  ...new Set(roles.flatMap((role) => rolePermissions[role])),
];
