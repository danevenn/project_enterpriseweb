import { describe, it, expect, vi } from "vitest";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { apiError, validationError, withRouteErrors } from "@/lib/api";

// El logger se silencia: en el camino 500 el wrapper registra el error, y no
// queremos ruido en la salida de los tests ni acoplar el assert a la consola.
vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

function prismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError(`Simulado ${code}`, {
    code,
    clientVersion: "test",
  });
}

describe("apiError", () => {
  it("devuelve el formato ApiError completo con título derivado del status", async () => {
    const res = apiError("Recurso no encontrado", 404);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: "NotFound",
      message: "Recurso no encontrado",
      statusCode: 404,
    });
  });

  it("permite añadir campos extra (p. ej. details)", async () => {
    const res = apiError("Datos inválidos", 400, { details: { name: ["requerido"] } });
    const body = await res.json();
    expect(body.details).toEqual({ name: ["requerido"] });
  });
});

describe("validationError", () => {
  it("devuelve 400 con error ValidationError y el detalle por campo", async () => {
    const schema = z.object({ name: z.string() });
    const parsed = schema.safeParse({});
    expect(parsed.success).toBe(false);

    const res = validationError(parsed.error!);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("ValidationError");
    expect(body.message).toBe("Datos inválidos");
    expect(body.details.name).toBeDefined();
  });
});

describe("withRouteErrors", () => {
  const req = new Request("http://localhost/api/test", { method: "POST" });

  it("deja pasar la respuesta cuando el handler no lanza", async () => {
    const handler = withRouteErrors(async () => Response.json({ ok: true }));
    const res = await handler(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("convierte un JSON malformado (SyntaxError) en 400", async () => {
    const handler = withRouteErrors(async () => {
      throw new SyntaxError("Unexpected token");
    });
    const res = await handler(req);
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/JSON válido/);
  });

  it("mapea P2025 a 404 con el mensaje del recurso", async () => {
    const handler = withRouteErrors(
      async () => {
        throw prismaError("P2025");
      },
      { notFound: "Material no encontrado" },
    );
    const res = await handler(req);
    expect(res.status).toBe(404);
    expect((await res.json()).message).toBe("Material no encontrado");
  });

  it("mapea P2002 a 409 (conflicto)", async () => {
    const handler = withRouteErrors(async () => {
      throw prismaError("P2002");
    });
    const res = await handler(req);
    expect(res.status).toBe(409);
  });

  it("mapea P2003 a 400 (referencia inválida)", async () => {
    const handler = withRouteErrors(async () => {
      throw prismaError("P2003");
    });
    const res = await handler(req);
    expect(res.status).toBe(400);
  });

  it("cualquier excepción inesperada se convierte en 500 estructurado", async () => {
    const handler = withRouteErrors(async () => {
      throw new Error("boom");
    });
    const res = await handler(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("InternalServerError");
    expect(body.statusCode).toBe(500);
  });
});
