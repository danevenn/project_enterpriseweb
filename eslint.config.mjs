import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Modo estricto sobre el código de la app: estas reglas son `error` (no
  // `warning`) para que el gate de CI las bloquee. `no-console` fuerza a pasar
  // por `src/lib/logger.ts` (único punto autorizado). Los argumentos no usados
  // se permiten solo si empiezan por `_` (convención para parámetros ignorados,
  // p. ej. `_req`).
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Artefactos de testing generados.
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "e2e/.auth/**",
  ]),
]);

export default eslintConfig;
