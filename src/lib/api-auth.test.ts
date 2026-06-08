import { describe, it, expect, vi, beforeEach } from "vitest";

// getServerSession se mockea para controlar la sesión sin NextAuth real.
const getServerSessionMock = vi.fn();
vi.mock("next-auth", () => ({
  getServerSession: (...args: unknown[]) => getServerSessionMock(...args),
}));

// El correo demo se lee a nivel de módulo, así que se fija ANTES de importar.
const DEMO = "demo@carpinterialosartesanos.com";
vi.stubEnv("NEXT_PUBLIC_DEMO_EMAIL", DEMO);

const { requireWriteAccess } = await import("@/lib/api-auth");

beforeEach(() => getServerSessionMock.mockReset());

describe("requireWriteAccess", () => {
  it("devuelve 401 cuando no hay sesión (la API de escritura no es pública)", async () => {
    getServerSessionMock.mockResolvedValue(null);
    const res = await requireWriteAccess();
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });

  it("devuelve 403 cuando la sesión es la cuenta de demostración", async () => {
    getServerSessionMock.mockResolvedValue({ user: { email: DEMO } });
    const res = await requireWriteAccess();
    expect(res!.status).toBe(403);
    expect((await res!.json()).message).toMatch(/solo lectura/i);
  });

  it("permite (null) a un usuario autenticado normal", async () => {
    getServerSessionMock.mockResolvedValue({ user: { email: "empleado@taller.com" } });
    const res = await requireWriteAccess();
    expect(res).toBeNull();
  });
});
