import { test as setup, expect } from "@playwright/test";
import path from "node:path";

// Genera el storageState autenticado una sola vez. Hace login REAL con el
// proveedor de credenciales (validado contra Firebase) usando un usuario de
// test. Exporta sus credenciales antes de correr los E2E:
//   E2E_USER_EMAIL=... E2E_USER_PASSWORD=... pnpm test:e2e
const authFile = path.join(__dirname, ".auth/user.json");

setup("autenticar en el panel", async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Faltan E2E_USER_EMAIL / E2E_USER_PASSWORD. Crea un usuario Firebase de test " +
        "y expórtalos para ejecutar los E2E del panel (login real, decisión acordada).",
    );
  }

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();

  // El login redirige a /panel al validar la sesión.
  await page.waitForURL("**/panel**");
  await expect(page).toHaveURL(/\/panel/);

  await page.context().storageState({ path: authFile });
});
