export type Service = {
  slug: string;
  title: string;
  icon: string; // nombre del icono lucide-react
  tagline: string;
  description: string;
  features: string[];
  startingFrom?: string;
};

const SERVICES: Service[] = [
  {
    slug: "muebles-a-medida",
    title: "Muebles a medida",
    icon: "Armchair",
    tagline: "Piezas únicas diseñadas para tu espacio y tu manera de vivirlo.",
    description:
      "Diseñamos y construimos cada mueble desde cero, en estrecha colaboración contigo. Trabajamos con maderas nobles de origen sostenible y herrajes seleccionados pieza a pieza. Cada encargo pasa por una fase de bocetos, prototipo a escala cuando lo requiere la complejidad, y validación en taller antes del montaje final en tu casa.",
    features: [
      "Diseño personalizado con plano y maqueta",
      "Maderas nobles certificadas FSC o PEFC",
      "Acabados artesanales: aceite duro, goma laca, cera natural",
      "Montaje e instalación incluidos",
    ],
    startingFrom: "desde 1.800 €",
  },
  {
    slug: "restauracion",
    title: "Restauración",
    icon: "Hammer",
    tagline:
      "Devolver la vida a piezas con historia sin borrar lo que las hace únicas.",
    description:
      "Restauramos muebles antiguos, puertas históricas y elementos de patrimonio respetando criterios de reversibilidad y mínima intervención. Trabajamos con goma laca a muñequilla, marquetería tradicional, tratamientos curativos de carcoma y materiales coherentes con el original. Para piezas catalogadas coordinamos con el departamento de Patrimonio.",
    features: [
      "Diagnóstico previo con informe técnico",
      "Tratamientos curativos de xilófagos",
      "Reposición con maderas envejecidas coherentes",
      "Criterios de reversibilidad y registro fotográfico",
    ],
    startingFrom: "desde 850 €",
  },
  {
    slug: "carpinteria-estructural",
    title: "Carpintería estructural",
    icon: "Hexagon",
    tagline:
      "Estructuras de madera para vivir: altillos, pérgolas, escaleras, cubiertas.",
    description:
      "Diseñamos y montamos estructuras de madera certificada (GL24h, CLT, cedro, iroko) calculadas con ingeniería y ejecutadas con criterio constructivo tradicional. Resolvemos altillos, escaleras de tramo o helicoidales, pérgolas, porches y cubiertas con visibilidad estructural. Coordinamos con cálculo, herrería y obra civil.",
    features: [
      "Cálculo estructural con ingeniería colaboradora",
      "Madera laminada GL24h, CLT, maderas tropicales certificadas",
      "Ensambles tradicionales o con conectores ocultos",
      "Coordinación con obra civil, herrería y cubierta",
    ],
    startingFrom: "presupuesto a medida",
  },
];

export async function getAllServices(): Promise<Service[]> {
  return SERVICES;
}

export async function getServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  return SERVICES.find((s) => s.slug === slug);
}
