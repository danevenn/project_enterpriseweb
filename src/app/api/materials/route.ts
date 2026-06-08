import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createMaterialSchema, MATERIAL_SORT_FIELDS, SORT_ORDERS } from "@/lib/validations";
import { validationError, withRouteErrors } from "@/lib/api";
import { requireWriteAccess } from "@/lib/api-auth";

export const GET = withRouteErrors(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId");

  const sortByParam = searchParams.get("sortBy");
  const sortOrderParam = searchParams.get("sortOrder");
  const sortBy = MATERIAL_SORT_FIELDS.includes(sortByParam as (typeof MATERIAL_SORT_FIELDS)[number])
    ? (sortByParam as (typeof MATERIAL_SORT_FIELDS)[number])
    : "createdAt";
  const sortOrder = SORT_ORDERS.includes(sortOrderParam as (typeof SORT_ORDERS)[number])
    ? (sortOrderParam as (typeof SORT_ORDERS)[number])
    : "desc";

  const materials = await db.material.findMany({
    where: {
      name: search ? { contains: search, mode: "insensitive" } : undefined,
      categoryId: categoryId ?? undefined,
    },
    include: { category: { select: { id: true, name: true } } },
    orderBy: [{ [sortBy]: sortOrder }, { id: "asc" }],
  });

  return NextResponse.json(materials);
});

export const POST = withRouteErrors(
  async (request: Request) => {
    const body = await request.json();
    const result = createMaterialSchema.safeParse(body);

    if (!result.success) return validationError(result.error);

    const material = await db.material.create({
      data: result.data,
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(material, { status: 201 });
  },
  { guard: requireWriteAccess, invalidReference: "La categoría indicada no existe" },
);
