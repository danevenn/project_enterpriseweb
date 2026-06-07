import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/format";

// Intl.NumberFormat("es-ES") separa el número del símbolo € con un espacio
// estrecho de no separación (U+202F) o NBSP (U+00A0), no con un espacio normal.
// Normalizamos esos espacios antes de comparar para que la aserción sea estable
// en cualquier runtime de ICU.
const normalize = (s: string) => s.replace(/[\u00A0\u202F]/g, " ");

describe("formatPrice", () => {
  it("formatea el precio con símbolo de euro y dos decimales", () => {
    expect(normalize(formatPrice(89.5))).toBe("89,50 €");
  });

  it("maneja correctamente los precios con cero céntimos", () => {
    expect(normalize(formatPrice(20))).toBe("20,00 €");
  });

  it("acepta el precio como string (Decimal serializado de la API)", () => {
    expect(normalize(formatPrice("34.90"))).toBe("34,90 €");
  });

  it("no agrupa los millares con 4 dígitos (regla del español)", () => {
    // En es-ES (CLDR) el separador de miles solo aparece a partir de 5 cifras.
    expect(normalize(formatPrice(1290))).toBe("1290,00 €");
  });

  it("agrupa los millares a partir de 5 dígitos", () => {
    expect(normalize(formatPrice(12900))).toBe("12.900,00 €");
  });
});
