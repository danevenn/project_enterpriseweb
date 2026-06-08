import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Configuración para tests unitarios y de componente (jsdom + MSW).
// Los tests de integración con BD real viven en vitest.integration.config.ts
// y los E2E en Playwright; ambos se excluyen aquí para que `pnpm test` corra
// sin necesidad de Postgres ni servidor.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["src/test/integration/**", "e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      // text → resumen en consola; html → informe navegable local;
      // lcov → fichero que Codecov ingiere en CI (coverage/lcov.info).
      reporter: ["text", "html", "lcov"],
      // Limitamos la cobertura a los módulos que esta suite ejercita de verdad,
      // para que los umbrales sean significativos (no diluidos por la app entera).
      include: [
        "src/lib/product-utils.ts",
        "src/lib/material-utils.ts",
        "src/lib/format.ts",
        "src/lib/api.ts",
        "src/stores/ui-store.ts",
        "src/components/product-list.tsx",
        "src/components/category-filter.tsx",
      ],
      exclude: ["src/test/**", "src/**/*.stories.{ts,tsx}"],
      thresholds: {
        // Las utilidades puras de inventario deben ir al 100% (requisito del
        // entregable): son lógica de negocio aislada y exhaustivamente testeable.
        "src/lib/product-utils.ts": { lines: 100, functions: 100, statements: 100 },
        "src/lib/material-utils.ts": { lines: 100, functions: 100, statements: 100 },
        "src/lib/format.ts": { lines: 100, functions: 100, statements: 100 },
        // Resto de módulos cubiertos: umbral general.
        lines: 80,
        functions: 80,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
