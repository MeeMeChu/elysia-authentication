import Elysia from "elysia";
import { authController } from "./auth";

const routes = new Elysia().group("/api/v1", (app) => app.use(authController));

export { routes as AppRoutes };
