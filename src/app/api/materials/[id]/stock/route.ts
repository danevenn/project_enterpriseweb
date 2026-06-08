import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateMaterialStockSchema } from "@/lib/validations";
import { validationError, withRouteErrors } from "@/lib/api";
import { requireWriteAccess } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export const PATCH = withRouteErrors(
  async (request: Request, { params }: Params) => {
    const { id } = await params;
    const body = await request.json();
    const result = updateMaterialStockSchema.safeParse(body);

    if (!result.success) return validationError(result.error);

    const material = await db.material.update({
      where: { id },
      data: { stock: result.data.stock },
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(material);
  },
  { guard: requireWriteAccess, notFound: "Material no encontrado" },
);
