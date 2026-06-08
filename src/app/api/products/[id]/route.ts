import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateProductSchema } from "@/lib/validations";
import { validationError, withRouteErrors } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

const PRODUCT_ERRORS = {
  notFound: "Producto no encontrado",
  invalidReference: "La categoría indicada no existe",
};

export const PATCH = withRouteErrors(async (request: Request, { params }: Params) => {
  const { id } = await params;
  const body = await request.json();
  const result = updateProductSchema.safeParse(body);

  if (!result.success) return validationError(result.error);

  const product = await db.product.update({
    where: { id },
    data: result.data,
    include: { category: { select: { id: true, name: true } } },
  });
  return NextResponse.json(product);
}, PRODUCT_ERRORS);

export const DELETE = withRouteErrors(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  await db.product.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}, PRODUCT_ERRORS);
