import { z } from "zod";

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(["test", "development", "production"]).default("development"),
  PORT: z.string().default("8000"),

  DATABASE_URL: z.url().optional(),
  BETTER_AUTH_SECRET: z.string(),
  
  // JWT (ใช้ BETTER_AUTH_SECRET เป็น default ถ้าไม่ได้กำหนด)
  ACCESS_TOKEN_SECRET: z.string().optional(),
  REFRESH_TOKEN_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
