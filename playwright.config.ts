import { defineConfig, devices } from "@playwright/test";

// E2E del inventario de Carpintería Los Artesanos.
// El panel está protegido por NextAuth + Firebase: el proyecto `setup` hace
// login real una vez y guarda la sesión en e2e/.auth/user.json (storageState),
// que reutilizan el resto de tests para entrar a /panel sin re-loguear.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: "e2e/.auth/user.json" },
      dependencies: ["setup"],
    },
  ],
  // Reutiliza el servidor de dev si ya está corriendo (p. ej. el de launch.json
  // en el puerto 3000); si no, lo levanta.
  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
