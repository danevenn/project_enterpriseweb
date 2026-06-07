import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createProjectSchema } from "@/lib/validations";
import { validationError } from "@/lib/api";

const BLUR_FALLBACK =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABT/2Q==";

export async function GET() {
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
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = createProjectSchema.safeParse(body);

  if (!result.success) return validationError(result.error);

  const { blurDataURL, ...data } = result.data;
  try {
    const project = await db.project.create({
      data: { ...data, blurDataURL: blurDataURL || BLUR_FALLBACK },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un proyecto con ese slug" },
        { status: 409 },
      );
    }
    throw error;
  }
}
