import { z } from "zod";
import pkgJson from "./../../package.json";

/**
 * 🧩 Define schema for package.json validation using Zod
 * Ensures that required metadata fields exist and provides defaults for missing ones.
 */
const PackageJsonSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  version: z.string().default("0.0.0"),
  description: z
    .string()
    .default("Production-ready RESTful API built with Bun + Elysia"),
});

/**
 * ✅ Validate and parse the package metadata.
 * If any field is missing, Zod will fill it with safe defaults.
 */
export const pkgMeta = PackageJsonSchema.parse(pkgJson);

/**
 * 🧠 Export TypeScript type for strong type inference.
 */
export type PackageMeta = z.infer<typeof PackageJsonSchema>;