import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateProjectSchema } from "@/lib/validations";
import { apiError, validationError, withRouteErrors } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

const PROJECT_ERRORS = {
  notFound: "Proyecto no encontrado",
  conflict: "Ya existe un proyecto con ese slug",
};

export const GET = withRouteErrors(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) return apiError("Proyecto no encontrado", 404);
  return NextResponse.json(project);
});

export const PATCH = withRouteErrors(async (request: Request, { params }: Params) => {
  const { id } = await params;
  const body = await request.json();
  const result = updateProjectSchema.safeParse(body);

  if (!result.success) return validationError(result.error);

  const project = await db.project.update({ where: { id }, data: result.data });
  return NextResponse.json(project);
}, PROJECT_ERRORS);

export const DELETE = withRouteErrors(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  await db.project.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}, PROJECT_ERRORS);
