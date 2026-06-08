import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateMaterialSchema } from "@/lib/validations";
import { validationError, withRouteErrors } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

const MATERIAL_ERRORS = {
  notFound: "Material no encontrado",
  invalidReference: "La categoría indicada no existe",
};

export const PATCH = withRouteErrors(async (request: Request, { params }: Params) => {
  const { id } = await params;
  const body = await request.json();
  const result = updateMaterialSchema.safeParse(body);

  if (!result.success) return validationError(result.error);

  const material = await db.material.update({
    where: { id },
    data: result.data,
    include: { category: { select: { id: true, name: true } } },
  });
  return NextResponse.json(material);
}, MATERIAL_ERRORS);

export const DELETE = withRouteErrors(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  await db.material.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}, MATERIAL_ERRORS);
