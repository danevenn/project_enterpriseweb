import type { MetadataRoute } from "next";
import { getAllProjects } from "@/data/projects";

const SITE = "https://task6-site-woodwork.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/sobre-nosotros`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE}/proyectos`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/contacto`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE}/proyectos/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.8,
  }));
  return [...staticRoutes, ...projectRoutes];
}
