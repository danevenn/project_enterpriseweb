import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createProductCategorySchema } from "@/lib/validations";
import { validationError, withRouteErrors } from "@/lib/api";

export const GET = withRouteErrors(async () => {
  const categories = await db.productCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
});

export const POST = withRouteErrors(
  async (request: Request) => {
    const body = await request.json();
    const result = createProductCategorySchema.safeParse(body);

    if (!result.success) return validationError(result.error);

    const category = await db.productCategory.create({ data: result.data });
    return NextResponse.json(category, { status: 201 });
  },
  { conflict: "Ya existe una categoría con ese nombre" },
);
