import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Wrapper de React Query para los tests de componente. Desactivamos los
// reintentos para que un fallo de red se propague de inmediato al estado de
// error (sin esperas), y silenciamos los logs de error de la query.
export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}
