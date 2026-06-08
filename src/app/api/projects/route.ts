import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createProjectSchema } from "@/lib/validations";
import { validationError, withRouteErrors } from "@/lib/api";
import { requireWriteAccess } from "@/lib/api-auth";

const BLUR_FALLBACK =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABT/2Q==";

export const GET = withRouteErrors(async () => {
  const projects = await db.project.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      year: true,
      client: true,
      featured: true,
      image: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(projects);
});

export const POST = withRouteErrors(
  async (request: Request) => {
    const body = await request.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) return validationError(result.error);

    const { blurDataURL, ...data } = result.data;
    const project = await db.project.create({
      data: { ...data, blurDataURL: blurDataURL || BLUR_FALLBACK },
    });
    return NextResponse.json(project, { status: 201 });
  },
  { guard: requireWriteAccess, conflict: "Ya existe un proyecto con ese slug" },
);
