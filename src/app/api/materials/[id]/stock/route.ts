import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { updateMaterialStockSchema } from "@/lib/validations";
import { validationError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const result = updateMaterialStockSchema.safeParse(body);

  if (!result.success) return validationError(result.error);

  try {
    const material = await db.material.update({
      where: { id },
      data: { stock: result.data.stock },
      include: { category: { select: { id: true, name: true } } },
    });
    return NextResponse.json(material);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Material no encontrado" }, { status: 404 });
    }
    throw error;
  }
}
