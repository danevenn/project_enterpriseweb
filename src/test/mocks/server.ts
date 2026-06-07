import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Servidor MSW para el entorno Node de Vitest. Intercepta las peticiones que
// hacen los componentes/hook (fetch) sin levantar la API real.
export const server = setupServer(...handlers);
