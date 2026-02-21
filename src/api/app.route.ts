import Elysia from "elysia";
import { UserController } from "./user";

const routes = new Elysia().group("/api/v1", (app) => app.use(UserController));

export { routes as AppRoutes };
