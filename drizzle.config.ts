import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});
export default defineConfig({
  schema: "./server/schema.ts",
  out: "./server",
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL!,
  },
});
