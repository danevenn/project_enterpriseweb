export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  projectSlug?: string;
  rating?: number;
  featured?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "marta-vilanova",
    quote:
      "La mesa tiene presencia sin imponerse. Es lo primero que se nota al entrar y lo último que se mira al salir.",
    author: "Marta Vilanova",
    role: "Propietaria · Empordà",
    projectSlug: "mesa-roble-macizo",
    rating: 5,
    featured: true,
  },
  {
    id: "clara-riera",
    quote:
      "Mi bisabuelo lo encargó en 1908. No quería verlo nuevo, quería verlo en pie cien años más. Eso es exactamente lo que devolvieron.",
    author: "Clara Riera",
    role: "Cuarta generación familiar",
    projectSlug: "restauracion-armario-modernista",
    rating: 5,
    featured: true,
  },
  {
    id: "jp-marchand",
    quote:
      "Imposible saber que dentro hay un compresor. Mis amigos sumilleres pensaban que era un bargueño antiguo restaurado.",
    author: "Jean-Philippe Marchand",
    role: "Coleccionista de vinos",
    projectSlug: "vitrina-art-deco-vinos",
    rating: 5,
    featured: true,
  },
  {
    id: "arq-vives",
    quote:
      "Subir y bajar es una experiencia. La gente que viene de visita se para a media altura sin saber por qué.",
    author: "Arq. Vives",
    role: "Arquitectura Vives · Sant Cugat",
    projectSlug: "escalera-helicoidal-iroko",
    rating: 5,
    featured: true,
  },
  {
    id: "eduard-pons",
    quote:
      "Tres años después, sigue recta como el primer día. La sutileza del detalle solo se ve cuando ya la has vivido.",
    author: "Eduard Pons",
    role: "Editor · Sant Gervasi",
    projectSlug: "biblioteca-nogal-suspendida",
    rating: 5,
  },
];

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return TESTIMONIALS;
}

export async function getFeaturedTestimonials(
  limit?: number,
): Promise<Testimonial[]> {
  const featured = TESTIMONIALS.filter((t) => t.featured === true);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getTestimonialByProjectSlug(
  slug: string,
): Promise<Testimonial | undefined> {
  return TESTIMONIALS.find((t) => t.projectSlug === slug);
}
