import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateProductCategorySchema } from "@/lib/validations";
import { apiError, validationError, withRouteErrors } from "@/lib/api";
import { requireWriteAccess } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

const CATEGORY_ERRORS = {
  guard: requireWriteAccess,
  notFound: "Categoría no encontrada",
  conflict: "Ya existe una categoría con ese nombre",
};

export const PATCH = withRouteErrors(async (request: Request, { params }: Params) => {
  const { id } = await params;
  const body = await request.json();
  const result = updateProductCategorySchema.safeParse(body);

  if (!result.success) return validationError(result.error);

  const category = await db.productCategory.update({ where: { id }, data: result.data });
  return NextResponse.json(category);
}, CATEGORY_ERRORS);

export const DELETE = withRouteErrors(async (_req: Request, { params }: Params) => {
  const { id } = await params;

  // Guarda de integridad: no permitir borrar una categoría con productos.
  const productCount = await db.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return apiError(
      `No se puede borrar: la categoría tiene ${productCount} producto(s) asociado(s)`,
      409,
    );
  }

  await db.productCategory.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}, CATEGORY_ERRORS);
