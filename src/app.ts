import { Elysia } from "elysia";
import { env } from "./config/env";

import cors from "@elysiajs/cors";
import { errorHandler } from "@error/global.error";
import { pkgMeta } from "@config/package";
import { logger } from "@lib/logger";
import { AppRoutes, ProtectedRoutes } from "./api/app.route";
import { runningSeeds } from "@script/seed";
import { openapiPlugin } from "@config/openapi";

const app = new Elysia()
  .onError(errorHandler)
  .use(cors({ origin: [env.FRONTEND_URL], credentials: true }))
  .use(openapiPlugin)
  .use(AppRoutes)
  .use(ProtectedRoutes);

app.listen(env.PORT, ({ port }) => {
  logger.info(
    `🦊 ${pkgMeta.name} v${pkgMeta.version} running on http://${app.server?.hostname}:${port}`,
  );
});

const initializeApp = async () => {
  try {
    await runningSeeds();
  } catch (error) {
    logger.error({ err: error }, "Failed to initialize app");
  }
};

if (env.NODE_ENV === "development") {
  await initializeApp();
}
