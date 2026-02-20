import Elysia from "elysia";
import { UserController } from "./user";
import { authController } from "./auth";

const routes = new Elysia().group("/api/v1", (app) => 
  app
    .use(authController)
    .use(UserController)
);

export { routes as AppRoutes };
