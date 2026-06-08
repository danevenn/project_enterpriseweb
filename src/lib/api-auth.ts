import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiError } from "@/lib/api";

// Correo de la cuenta de demostración pública (solo lectura). Es público a
// propósito (se expone en la demo), por eso vive en una NEXT_PUBLIC_*. Si no
// está definido, no hay cuenta demo y solo aplica la exigencia de sesión.
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL;

/**
 * Guarda de escritura para las Route Handlers que mutan datos. Devuelve una
 * respuesta de error si el acceso NO está permitido, o `null` si sí lo está.
 * Pensado para usarse como `guard` en `withRouteErrors`.
 *
 * - Sin sesión → 401 (la API de escritura no es pública).
 * - Sesión de la cuenta de demostración → 403 (panel de solo lectura).
 * - Cualquier otro usuario autenticado → permitido.
 */
export async function requireWriteAccess(): Promise<Response | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return apiError("Necesitas iniciar sesión para realizar esta operación", 401);
  }

  if (DEMO_EMAIL && session.user.email === DEMO_EMAIL) {
    return apiError(
      "Cuenta de demostración: el panel es de solo lectura, los cambios no se guardan",
      403,
    );
  }

  return null;
}
