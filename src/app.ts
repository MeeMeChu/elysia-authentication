import { Elysia } from "elysia";
import { env } from "./config/env";

import cors from "@elysiajs/cors";
import cookie from "@elysiajs/cookie";
import openapi from "@elysiajs/openapi";
import { errorHandler } from "@error/global.error";
import { pkgMeta } from "@config/package";
import { logger } from "@lib/logger";
import { AppRoutes } from "@module/app.route";

const app = new Elysia()
  .onError(errorHandler)
  .use(cors())
  .use(cookie())
  .use(
    openapi({
      path: "/openapi",
      documentation: {
        info: {
          title: pkgMeta.name,
          version: pkgMeta.version,
          description: pkgMeta.description,
        },
        servers: [
          {
            url: `http://localhost:${env.PORT}`,
            description: `${env.NODE_ENV} server`,
          },
        ],
      },
    }),
  )
  .use(AppRoutes); // Register application routes

app.listen(env.PORT, ({ port }) => {
  logger.info(
    `🦊 ${pkgMeta.name} v${pkgMeta.version} running on http://${app.server?.hostname}:${port}`,
  );
});

// Run database seeding on startup
const initializeApp = async () => {
  try {
    // await runningSeeds();
  } catch (error) {
    logger.error({ err: error }, "Failed to initialize app:");
  }
};

// Initialize the app
initializeApp();
