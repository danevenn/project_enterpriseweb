import { PrismaClient, Prisma } from "@prisma/client";
import { PROJECTS } from "./seed-data/projects";

const db = new PrismaClient();

async function main() {
  // Idempotente: limpiamos antes de sembrar. El borrado de categorías va después
  // de sus hijos porque la relación usa onDelete: Restrict.
  await db.product.deleteMany();
  await db.productCategory.deleteMany();
  await db.material.deleteMany();
  await db.materialCategory.deleteMany();
  await db.project.deleteMany();

  // ---------------------------------------------------------------------------
  // Catálogo de productos (muebles / piezas terminadas)
  // ---------------------------------------------------------------------------
  const [mueblesMedida, restauracion, complementos] = await Promise.all([
    db.productCategory.create({
      data: {
        name: "Muebles a medida",
        description: "Piezas únicas diseñadas y construidas en taller.",
      },
    }),
    db.productCategory.create({
      data: {
        name: "Restauración",
        description: "Mobiliario antiguo recuperado y puesto en valor.",
      },
    }),
    db.productCategory.create({
      data: {
        name: "Complementos",
        description: "Objetos y accesorios de pequeño formato.",
      },
    }),
  ]);

  const productos: Prisma.ProductCreateManyInput[] = [
    {
      name: "Mesa de comedor en roble",
      description: "Tablero macizo de roble francés, patas de acero negro.",
      price: new Prisma.Decimal("2400.00"),
      stock: 2,
      categoryId: mueblesMedida.id,
    },
    {
      name: "Estantería modular de fresno",
      description: "Sistema apilable de baldas en fresno macizo.",
      price: new Prisma.Decimal("980.00"),
      stock: 4,
      categoryId: mueblesMedida.id,
    },
    {
      name: "Aparador nórdico de nogal",
      description: "Tres cuerpos con puertas correderas y patas torneadas.",
      price: new Prisma.Decimal("1650.00"),
      stock: 1,
      categoryId: mueblesMedida.id,
    },
    {
      name: "Cómoda art déco restaurada",
      description: "Pieza de los años 30 con chapa de palisandro recuperada.",
      price: new Prisma.Decimal("1200.00"),
      stock: 1,
      categoryId: restauracion.id,
    },
    {
      name: "Silla Thonet renovada",
      description: "Asiento de rejilla reentramado a mano y barniz a goma laca.",
      price: new Prisma.Decimal("320.00"),
      stock: 6,
      categoryId: restauracion.id,
    },
    {
      name: "Tabla de cortar de olivo",
      description: "Pieza maciza de olivo con acabado alimentario.",
      price: new Prisma.Decimal("65.00"),
      stock: 18,
      categoryId: complementos.id,
    },
    {
      name: "Perchero de pared en haya",
      description: "Listón de haya vaporizada con ganchos de latón.",
      price: new Prisma.Decimal("89.00"),
      stock: 10,
      categoryId: complementos.id,
    },
  ];
  await db.product.createMany({ data: productos });

  // ---------------------------------------------------------------------------
  // Inventario de materiales de taller
  // ---------------------------------------------------------------------------
  const [maderas, herrajes, acabados, consumibles] = await Promise.all([
    db.materialCategory.create({
      data: { name: "Maderas", description: "Tableros, tablas y listones." },
    }),
    db.materialCategory.create({
      data: { name: "Herrajes", description: "Bisagras, guías, tornillería." },
    }),
    db.materialCategory.create({
      data: { name: "Acabados", description: "Aceites, barnices, ceras y tintes." },
    }),
    db.materialCategory.create({
      data: { name: "Consumibles", description: "Abrasivos, colas y auxiliares." },
    }),
  ]);

  const materiales: Prisma.MaterialCreateManyInput[] = [
    {
      name: "Tabla de roble francés FSC",
      description: "Tabla cepillada 27 mm, secado al 8% HR.",
      unit: "M2",
      stock: new Prisma.Decimal("32.500"),
      minStock: new Prisma.Decimal("10.000"),
      costPerUnit: new Prisma.Decimal("78.00"),
      supplier: "Maderas Olot",
      categoryId: maderas.id,
    },
    {
      name: "Tablero contrachapado de abedul 18 mm",
      description: "Multicapa de abedul báltico, calidad B/BB.",
      unit: "M2",
      stock: new Prisma.Decimal("48.000"),
      minStock: new Prisma.Decimal("12.000"),
      costPerUnit: new Prisma.Decimal("42.50"),
      supplier: "Finsa",
      categoryId: maderas.id,
    },
    {
      name: "Listón de fresno macizo 40x40",
      description: "Para estructuras y espigas vistas.",
      unit: "M",
      stock: new Prisma.Decimal("120.000"),
      minStock: new Prisma.Decimal("30.000"),
      costPerUnit: new Prisma.Decimal("6.80"),
      supplier: "Maderas Olot",
      categoryId: maderas.id,
    },
    {
      name: "Bisagra de cazoleta 35 mm",
      description: "Cierre suave, apertura 110°.",
      unit: "UD",
      stock: new Prisma.Decimal("240.000"),
      minStock: new Prisma.Decimal("50.000"),
      costPerUnit: new Prisma.Decimal("2.30"),
      supplier: "Blum",
      categoryId: herrajes.id,
    },
    {
      name: "Guía telescópica 450 mm",
      description: "Extracción total, 40 kg de carga.",
      unit: "UD",
      stock: new Prisma.Decimal("80.000"),
      minStock: new Prisma.Decimal("20.000"),
      costPerUnit: new Prisma.Decimal("9.10"),
      supplier: "Hettich",
      categoryId: herrajes.id,
    },
    {
      name: "Tornillo Spax 4x40",
      description: "Cabeza avellanada, caja de 500 ud.",
      unit: "UD",
      stock: new Prisma.Decimal("3500.000"),
      minStock: new Prisma.Decimal("500.000"),
      costPerUnit: new Prisma.Decimal("0.04"),
      supplier: "Spax",
      categoryId: herrajes.id,
    },
    {
      name: "Aceite duro Osmo Polyx 3032",
      description: "Acabado incoloro satinado, base aceite-cera.",
      unit: "L",
      stock: new Prisma.Decimal("18.500"),
      minStock: new Prisma.Decimal("5.000"),
      costPerUnit: new Prisma.Decimal("32.00"),
      supplier: "Osmo",
      categoryId: acabados.id,
    },
    {
      name: "Goma laca en escamas",
      description: "Para muñequilla y acabados de restauración.",
      unit: "KG",
      stock: new Prisma.Decimal("2.400"),
      minStock: new Prisma.Decimal("1.000"),
      costPerUnit: new Prisma.Decimal("48.00"),
      supplier: "Restauro",
      categoryId: acabados.id,
    },
    {
      name: "Lija de grano 240",
      description: "Rollo de 5 m, óxido de aluminio.",
      unit: "M",
      stock: new Prisma.Decimal("60.000"),
      minStock: new Prisma.Decimal("15.000"),
      costPerUnit: new Prisma.Decimal("1.20"),
      supplier: "Mirka",
      categoryId: consumibles.id,
    },
    {
      name: "Cola de carpintero D3",
      description: "Adhesivo PVA resistente a la humedad.",
      unit: "L",
      stock: new Prisma.Decimal("8.000"),
      minStock: new Prisma.Decimal("3.000"),
      costPerUnit: new Prisma.Decimal("11.50"),
      supplier: "Titebond",
      categoryId: consumibles.id,
    },
  ];
  await db.material.createMany({ data: materiales });

  // ---------------------------------------------------------------------------
  // Portfolio de proyectos (datos en prisma/seed-data/projects.ts)
  // ---------------------------------------------------------------------------
  for (const p of PROJECTS) {
    await db.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        shortDescription: p.shortDescription,
        description: p.description,
        image: p.image,
        blurDataURL: p.blurDataURL,
        gallery: p.gallery,
        materials: p.materials,
        year: p.year,
        client: p.client,
        durationWeeks: p.durationWeeks,
        tags: p.tags ?? [],
        challenges: p.challenges ?? [],
        techniques: p.techniques ?? [],
        dimensions: (p.dimensions as Prisma.InputJsonValue) ?? Prisma.DbNull,
        process: (p.process as Prisma.InputJsonValue) ?? Prisma.DbNull,
        testimonial: (p.testimonial as Prisma.InputJsonValue) ?? Prisma.DbNull,
        featured: p.featured ?? false,
      },
    });
  }

  console.log(
    `Seed completado: ${productos.length} productos, ${materiales.length} materiales y ${PROJECTS.length} proyectos.`,
  );
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
