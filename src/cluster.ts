import cluster from "node:cluster";
import os from "node:os";
import process from "node:process";
import { env } from "@config/env";
import { logger } from "@lib/logger";

if (cluster.isPrimary) {
  if (env.NODE_ENV === "production") {
    const { runningSeeds } = await import("./script/seed");
    await runningSeeds();
  }

  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
} else {
  await import("./app");
  logger.info(`Worker ${process.pid} started`);
}
