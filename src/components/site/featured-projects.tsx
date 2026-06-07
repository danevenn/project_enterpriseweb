import { getFeaturedProjects, getRecentProjects } from "@/data/projects";
import { ProjectCard } from "@/components/site/project-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export async function FeaturedProjects() {
  // Primero featured; si no hay suficientes, completamos con recientes.
  const featured = await getFeaturedProjects();
  const projects = featured.slice(0, 3);
  if (projects.length < 3) {
    const recent = await getRecentProjects(6);
    const slugs = new Set(projects.map((p) => p.slug));
    for (const p of recent) {
      if (projects.length >= 3) break;
      if (!slugs.has(p.slug)) projects.push(p);
    }
  }

  return (
    <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
      {projects.map((p) => (
        <StaggerItem key={p.slug}>
          <ProjectCard project={p} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
