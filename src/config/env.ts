import { z } from "zod";

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(["test", "development", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8000),
  API_KEY: z.string().min(1),
  FRONTEND_URL: z.url().default("http://localhost:5173"),

  DATABASE_URL: z.url().optional(),

  // JWT
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);
