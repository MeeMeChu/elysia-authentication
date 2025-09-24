import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['test', 'development', 'production'])
    .default('development'),
  PORT: z.string().default('8000'),
});

export const env = envSchema.parse(process.env);