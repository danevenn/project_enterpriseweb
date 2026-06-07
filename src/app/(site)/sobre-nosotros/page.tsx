import Image from "next/image";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description:
    "La historia de Carpintería Los Artesanos, un taller familiar fundado en 1962, y el proceso artesanal con el que trabajamos cada pieza.",
};

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Escucha y diseño",
    body: "Visitamos el espacio, conversamos sobre el uso y dibujamos a mano alzada las primeras propuestas. Solo cuando el cliente reconoce su pieza pasamos al plano técnico.",
  },
  {
    step: "02",
    title: "Selección de la madera",
    body: "Elegimos personalmente cada tabla en el almacén. Buscamos veta, color y secado correctos. La madera mal seleccionada nunca llega al taller.",
  },
  {
    step: "03",
    title: "Mecanizado y ensamble",
    body: "Combinamos maquinaria de precisión con herramienta de mano. Las uniones críticas —espigas, colas de milano, lambdas— se ajustan a mano hasta encajar sin holgura.",
  },
  {
    step: "04",
    title: "Acabado a poro abierto",
    body: "Lijamos en cinco gramajes ascendentes hasta dejar la superficie sedosa. Aplicamos aceites y ceras naturales que respetan el tacto de la madera y permiten su mantenimiento.",
  },
  {
    step: "05",
    title: "Instalación y seguimiento",
    body: "Llevamos la pieza con guantes y mantas. Volvemos a los seis meses para un repaso preventivo de tornillería, ajustes estacionales y refresco del acabado si hace falta.",
  },
];

const WORKSHOP_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=1200&q=80",
    alt: "Banco de trabajo con cepillos y formones de carpintería",
  },
  {
    src: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1200&q=80",
    alt: "Detalle de virutas de madera tras un cepillado manual",
  },
  {
    src: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=1200&q=80",
    alt: "Tablas de roble apiladas en el almacén del taller",
  },
  {
    src: "https://images.unsplash.com/photo-1604066867775-43f48e3957d8?auto=format&fit=crop&w=1200&q=80",
    alt: "Herramientas tradicionales de carpintería ordenadas en la pared",
  },
];

export default function AboutPage() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <Reveal as="header" className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          Tres generaciones de oficio
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">
          La historia del taller
        </h1>
      </Reveal>

      <Reveal className="relative mt-12 aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-foreground/10">
        <Image
          src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=2000&q=80"
          alt="Interior del taller con herramientas de carpintería sobre el banco de trabajo"
          fill
          sizes="(min-width: 1024px) 56rem, 100vw"
          className="object-cover"
        />
      </Reveal>

      <Reveal as="section" className="prose prose-stone mt-12 max-w-none text-foreground/85 leading-relaxed">
        <p className="text-lg">
          Carpintería Los Artesanos nació en 1962 en un patio interior del barrio
          de Gràcia. Antoni Vallès, abuelo de los actuales propietarios, montó allí
          su primer banco de trabajo después de aprender el oficio durante diez
          años en un taller de ebanistería del Eixample. Empezó haciendo encargos
          pequeños para los vecinos —una mesa, una repisa, el cabezal de una
          cama— y nunca dejó de hacerlos.
        </p>
        <p className="mt-6">
          Sesenta años después seguimos en el mismo barrio. El taller se ha
          ampliado dos veces, las máquinas son nuevas y los procesos de
          presupuesto se gestionan por correo, pero el corazón del trabajo sigue
          siendo el mismo: una persona, una pieza de madera y el tiempo
          suficiente para hacerlo bien. Hoy somos cinco personas en plantilla
          —tres ebanistas, una restauradora y una arquitecta técnica— y
          colaboramos con herreros, tapiceros y cristaleros del barrio para los
          encargos que lo requieren.
        </p>
        <p className="mt-6">
          Trabajamos con maderas certificadas FSC o PEFC siempre que es posible,
          recuperamos vigas y tarimas antiguas de derribos cercanos y, cuando
          un mueble llega para restaurar, intentamos conservar el máximo de
          material original. La sostenibilidad no es para nosotros una etiqueta:
          es la forma natural de trabajar de un oficio que entiende la madera
          como un recurso finito y precioso.
        </p>
      </Reveal>

      <Separator className="my-16" />

      <section>
        <Reveal className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Método
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">
            Nuestro proceso artesanal
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Cada encargo recorre cinco etapas. No las hemos inventado: son las
            que el oficio lleva siglos pidiendo.
          </p>
        </Reveal>

        <Stagger as="ol" speed="slow" className="mt-16 space-y-16 md:space-y-24">
          {PROCESS_STEPS.map((s, i) => {
            const alt = i % 2 === 1; // Alternar columnas
            return (
              <StaggerItem
                as="li"
                key={s.step}
                className="grid items-start gap-6 md:grid-cols-[auto_1fr] md:gap-12"
              >
                <span
                  className={`font-heading text-6xl font-bold leading-none text-accent/30 md:text-8xl ${
                    alt ? "md:order-2 md:text-right" : ""
                  }`}
                  aria-hidden
                >
                  {s.step}
                </span>
                <div className={alt ? "md:order-1 md:text-right" : ""}>
                  <p className="font-mono text-xs uppercase tracking-wider text-accent">
                    Fase {s.step}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-foreground/80 leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <Separator className="my-16" />

      <section>
        <Reveal className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            El taller
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">
            Dentro del espacio
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Madera, herramientas y silencio: la materia del oficio.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {WORKSHOP_IMAGES.map((img) => (
            <StaggerItem
              key={img.src}
              className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-foreground/10"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 22rem, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </article>
  );
}
