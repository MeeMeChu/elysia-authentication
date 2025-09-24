import { Elysia } from "elysia";
import logger from "logixlysia";
import { env } from "./config/env";
import { AppRoutes } from "./routers/app.routes";

const app = new Elysia().use(logger()).use(AppRoutes);

app.listen({ port: env.PORT });

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
