import {
  Armchair,
  CalendarClock,
  Compass,
  Hammer,
  HeartHandshake,
  Hexagon,
  Leaf,
  PackageCheck,
  Scroll,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa de iconos lucide-react usados en datos.
 * Si un icono no está mapeado, se devuelve `Hammer` por defecto.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Armchair,
  CalendarClock,
  Compass,
  Hammer,
  HeartHandshake,
  Hexagon,
  Leaf,
  PackageCheck,
  Scroll,
  Wrench,
};

export function getIcon(name?: string): LucideIcon {
  if (!name) return Hammer;
  return ICON_MAP[name] ?? Hammer;
}
