import { z } from "zod";

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(["test", "development", "production"]).default("development"),
  PORT: z.string().default("8000"),

  DATABASE_URL: z.url().optional(),

  // JWT
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);
