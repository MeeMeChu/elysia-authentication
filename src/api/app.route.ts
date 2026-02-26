import Elysia from "elysia";
import { authController } from "@controller/auth.controller";

const routes = new Elysia().group("/api/v1", (app) => app.use(authController));

export { routes as AppRoutes };
