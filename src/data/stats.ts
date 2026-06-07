export type Stat = {
  id: string;
  value: number;
  /** Sufijo visual: "+", "%", "k", etc. Vacío si no aplica. */
  suffix?: string;
  /** Prefijo visual: "€", "<", etc. */
  prefix?: string;
  label: string;
  description?: string;
  /** Nombre de icono lucide-react opcional. */
  icon?: string;
};

const STATS: Stat[] = [
  {
    id: "anos-oficio",
    value: 28,
    suffix: "+",
    label: "Años de oficio",
    description:
      "Tres generaciones acumuladas en el taller, desde el abuelo ebanista hasta el equipo actual.",
    icon: "CalendarClock",
  },
  {
    id: "proyectos-entregados",
    value: 340,
    suffix: "+",
    label: "Proyectos entregados",
    description:
      "Muebles a medida, restauraciones y obras estructurales completadas en Cataluña.",
    icon: "PackageCheck",
  },
  {
    id: "satisfaccion",
    value: 98,
    suffix: "%",
    label: "Clientes satisfechos",
    description:
      "Valoraciones de cliente al cierre del proyecto y a los doce meses de entrega.",
    icon: "HeartHandshake",
  },
  {
    id: "madera-certificada",
    value: 100,
    suffix: "%",
    label: "Madera certificada",
    description:
      "Toda nuestra madera nueva proviene de aprovechamientos FSC o PEFC verificables.",
    icon: "Leaf",
  },
];

export async function getAllStats(): Promise<Stat[]> {
  return STATS;
}

export async function getStatById(id: string): Promise<Stat | undefined> {
  return STATS.find((s) => s.id === id);
}
