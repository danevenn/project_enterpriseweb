import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { updateProjectSchema } from "@/lib/validations";
import { validationError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const result = updateProjectSchema.safeParse(body);

  if (!result.success) return validationError(result.error);

  try {
    const project = await db.project.update({ where: { id }, data: result.data });
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Ya existe un proyecto con ese slug" },
          { status: 409 },
        );
      }
    }
    throw error;
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    await db.project.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }
    throw error;
  }
}
