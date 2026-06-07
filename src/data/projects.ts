import type { Project as PrismaProject } from "@prisma/client";
import { db } from "@/lib/db";

// =============================================================================
// Tipos de dominio del portfolio (única fuente de verdad para la UI).
// Los datos viven en Postgres; estas funciones mapean las filas de Prisma al
// tipo `Project` que consumen las páginas y componentes del sitio público.
// =============================================================================

export type ProjectCategory =
  | "Muebles a medida"
  | "Restauración"
  | "Carpintería estructural";

export type ProjectDimensions = {
  width?: number;
  height?: number;
  depth?: number;
  unit: "cm" | "m";
};

export type ProjectPhase = {
  phase: string;
  description: string;
  weeks: number;
};

export type ProjectTestimonial = {
  quote: string;
  author: string;
  role: string;
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  description: string;
  image: string;
  blurDataURL: string;
  gallery: string[];
  materials: string[];
  year: number;
  client: string;
  durationWeeks: number;
  // Campos opcionales (retrocompatibilidad)
  dimensions?: ProjectDimensions;
  process?: ProjectPhase[];
  challenges?: string[];
  techniques?: string[];
  testimonial?: ProjectTestimonial;
  tags?: string[];
  featured?: boolean;
};

// Mapea una fila de Prisma al tipo de dominio `Project`. Los campos JSON
// (dimensions/process/testimonial) se castean a su forma conocida; los arrays
// vacíos se normalizan a `undefined` para respetar la opcionalidad del tipo.
function toProject(row: PrismaProject): Project {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category as ProjectCategory,
    shortDescription: row.shortDescription,
    description: row.description,
    image: row.image,
    blurDataURL: row.blurDataURL,
    gallery: row.gallery,
    materials: row.materials,
    year: row.year,
    client: row.client,
    durationWeeks: row.durationWeeks,
    dimensions: (row.dimensions as ProjectDimensions | null) ?? undefined,
    process: (row.process as ProjectPhase[] | null) ?? undefined,
    challenges: row.challenges.length ? row.challenges : undefined,
    techniques: row.techniques.length ? row.techniques : undefined,
    testimonial: (row.testimonial as ProjectTestimonial | null) ?? undefined,
    tags: row.tags.length ? row.tags : undefined,
    featured: row.featured,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const rows = await db.project.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toProject);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const row = await db.project.findUnique({ where: { slug } });
  return row ? toProject(row) : undefined;
}

export async function getRecentProjects(limit = 3): Promise<Project[]> {
  const rows = await db.project.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return rows.map(toProject);
}

export async function getFeaturedProjects(limit?: number): Promise<Project[]> {
  const rows = await db.project.findMany({
    where: { featured: true },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return rows.map(toProject);
}

export async function getProjectsByCategory(
  category: ProjectCategory,
): Promise<Project[]> {
  const rows = await db.project.findMany({
    where: { category },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toProject);
}

export async function getRelatedProjects(
  slug: string,
  limit = 3,
): Promise<Project[]> {
  const current = await db.project.findUnique({
    where: { slug },
    select: { category: true },
  });
  if (!current) return [];
  const rows = await db.project.findMany({
    where: { category: current.category, slug: { not: slug } },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return rows.map(toProject);
}
