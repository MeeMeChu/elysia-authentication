import Elysia from "elysia";
import { authController } from "@controller/auth.controller";
import { authMiddleware } from "@middleware/auth.middleware";

// ===== PUBLIC ROUTES (ไม่ต้อง authentication ที่ group level) =====
// Register / login are public endpoints.
const routes = new Elysia().group("/api/v1", (app) => app.use(authController));

// ===== PROTECTED ROUTES (ต้อง authentication) =====
const protectedRoutes = new Elysia().group("/api/v2", (app) =>
  app.use(authMiddleware).get("/me", ({ user }) => user),
);

export { routes as AppRoutes, protectedRoutes as ProtectedRoutes };
