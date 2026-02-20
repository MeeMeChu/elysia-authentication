import { z } from "zod";

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(["test", "development", "production"]).default("development"),
  PORT: z.string().default("8000"),

  DATABASE_URL: z.url().optional(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION: z.string().default("15m"),
  JWT_REFRESH_EXPIRATION: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);
