import { defineConfig } from "vitest/config";
import path from "node:path";
import { config as loadEnv } from "dotenv";

// Tests de integración de las Route Handlers contra una BD Postgres real.
// Carga .env.test (schema `test` separado en el mismo Docker, puerto 5433) para
// no tocar los datos de desarrollo. Entorno Node (no jsdom): aquí no hay DOM.
loadEnv({ path: ".env.test" });

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/test/integration/**/*.test.ts"],
    // La BD es estado compartido: sin paralelismo entre archivos para evitar
    // que un test pise las filas de otro.
    fileParallelism: false,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      DIRECT_URL: process.env.DIRECT_URL ?? "",
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
