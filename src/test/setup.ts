import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./mocks/server";
import { resetProducts } from "./mocks/handlers";

// Ciclo de vida de MSW para toda la suite jsdom:
// - beforeAll: arranca el servidor de mocks UNA vez (intercepta fetch en Node).
// - afterEach: resetea handlers añadidos en un test concreto (server.use) para
//   que no se filtren al siguiente; también desmonta el DOM de React.
// - afterAll: cierra el servidor y libera la intercepción.
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetProducts(); // restaura el estado en memoria mutado por POST/PATCH
});
afterAll(() => server.close());
