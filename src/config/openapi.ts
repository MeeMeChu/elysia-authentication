import Elysia from "elysia";
import openapi from "@elysiajs/openapi";
import { env } from "./env";
import { pkgMeta } from "./package";

const app = new Elysia();
const url = `http://localhost:${env.PORT}`;

// OpenAPI documentation - only enabled in non-production environments
export const openapiPlugin =
  env.NODE_ENV !== "production"
    ? openapi({
        path: "/docs",
        documentation: {
          info: {
            title: pkgMeta.name,
            version: pkgMeta.version,
            description: pkgMeta.description,
          },
          servers: [
            {
              url,
              description: `${env.NODE_ENV} server`,
            },
          ],
        },
      })
    : app; // Empty plugin in production
