import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { logger } from "@/lib/logger";

// Formato ÚNICO de error para toda la API. Cualquier respuesta de error de una
// Route Handler tiene esta forma, de modo que el cliente siempre puede leer
// `message` (texto para el usuario) y, si quiere, ramificar por `error` (código
// estable, legible por máquina) o por `statusCode`.
export interface ApiError {
  /** Código corto y estable del tipo de error (p. ej. "NotFound"). */
  error: string;
  /** Mensaje legible para el usuario, en español. */
  message: string;
  /** Código HTTP, duplicado en el cuerpo para clientes que solo leen el JSON. */
  statusCode: number;
}

// Título corto por defecto según el código HTTP. Mantiene `error` consistente
// sin obligar a cada call site a repetirlo.
const STATUS_TITLES: Record<number, string> = {
  400: "BadRequest",
  401: "Unauthorized",
  403: "Forbidden",
  404: "NotFound",
  409: "Conflict",
  422: "ValidationError",
  500: "InternalServerError",
};

/** Construye una respuesta de error con el formato `ApiError`. */
export function apiError(
  message: string,
  statusCode: number,
  extra?: Record<string, unknown>,
) {
  const body: ApiError & Record<string, unknown> = {
    error: STATUS_TITLES[statusCode] ?? "Error",
    message,
    statusCode,
    ...extra,
  };
  return NextResponse.json(body, { status: statusCode });
}

/** Respuesta 400 para fallos de validación de zod, con el detalle por campo. */
export function validationError(error: z.ZodError) {
  return apiError("Datos inválidos", 400, {
    error: "ValidationError",
    details: z.flattenError(error).fieldErrors,
  });
}

// Mensajes a medida por recurso para los errores conocidos de Prisma. Permiten
// que cada Route Handler conserve un texto útil para el usuario (el que se
// muestra en los toasts del panel) sin reintroducir try/catch en el handler.
export interface RouteErrorMessages {
  /** P2025 — registro no encontrado (404). */
  notFound?: string;
  /** P2002 — violación de restricción única (409). */
  conflict?: string;
  /** P2003 — clave foránea inválida (400). */
  invalidReference?: string;
}

// Mapea los errores conocidos de Prisma a un `ApiError`. Si el error no es uno
// de los esperados, devuelve null para que el wrapper lo trate como error
// inesperado (500) y lo registre.
function mapPrismaError(error: unknown, messages: RouteErrorMessages): NextResponse | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;
  switch (error.code) {
    case "P2025": // registro a actualizar/borrar no encontrado
      return apiError(messages.notFound ?? "El recurso solicitado no existe", 404);
    case "P2002": // violación de restricción única
      return apiError(messages.conflict ?? "Ya existe un registro con ese valor único", 409);
    case "P2003": // clave foránea inválida
      return apiError(messages.invalidReference ?? "La referencia indicada no existe", 400);
    default:
      return null;
  }
}

type RouteHandler<A extends unknown[]> = (
  request: Request,
  ...args: A
) => Promise<Response> | Response;

// Envoltorio para Route Handlers: garantiza que NINGÚN error escape como un 500
// genérico de Next. Captura JSON malformado (400), los errores conocidos de
// Prisma (vía mapPrismaError, con mensajes opcionales por recurso) y, como red
// de seguridad, cualquier excepción inesperada (500 + log estructurado). Así
// toda la API responde siempre con el formato `ApiError`.
export function withRouteErrors<A extends unknown[]>(
  handler: RouteHandler<A>,
  messages: RouteErrorMessages = {},
) {
  return async (request: Request, ...args: A): Promise<Response> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return apiError("El cuerpo de la petición no es JSON válido", 400);
      }
      const mapped = mapPrismaError(error, messages);
      if (mapped) return mapped;

      logger.error("[api] Error no controlado en una Route Handler", error, {
        url: request.url,
        method: request.method,
      });
      return apiError("Ha ocurrido un error inesperado en el servidor", 500);
    }
  };
}
