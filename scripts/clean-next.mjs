import { rm } from "node:fs/promises";
import { join } from "node:path";

const nextDir = join(process.cwd(), ".next");

try {
  await rm(nextDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200,
  });
  console.log("Cleaned .next build artifacts.");
} catch (error) {
  console.warn("Skipping .next cleanup:", error);
}
