// Datos semilla del portfolio. Los tipos de dominio viven en `src/data/projects.ts`
// (única fuente). Este archivo solo lo consume `prisma/seed.ts`.
import type { Project } from "../../src/data/projects";

// Blur placeholder reutilizable (4x4 JPEG gris cálido)
const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABT/2Q==";

export const PROJECTS: Project[] = [
  {
    slug: "mesa-roble-macizo",
    title: "Mesa de Roble Macizo",
    category: "Muebles a medida",
    shortDescription:
      "Mesa de comedor de 240 cm tallada a mano en roble francés con acabado de aceite duro.",
    description:
      "Pieza central diseñada para una vivienda en Aranjuez. El tablero se compone de tres tablas seleccionadas de roble francés de origen sostenible (Bercé, Loira), aclimatadas durante seis meses en el taller hasta estabilizar su humedad por debajo del 10 %. La unión se resolvió con espigas pasantes de fresno teñido en oscuro, dejando vista la testa como detalle gráfico que cose la composición.\n\nLas patas trapezoidales en acero negro mate fueron forjadas por un herrero de Yuncos, en la misma comarca, a partir de pletina de 12 mm y soldadas en fragua, no en MIG, para conservar la textura artesanal en las uniones. El conjunto se ancla al tablero mediante seis tornillos pasantes ocultos bajo tapón de fresno torneado a mano.\n\nEl acabado se ejecutó en tres manos de aceite duro Osmo Polyx, lijando con grano 240 entre capas y aplicando la última mano a muñequilla para forzar la penetración en los poros. El resultado es una superficie que respira, repara puntualmente y envejece sin amarillear, manteniendo el tacto natural de la madera.\n\nLa pieza pesa 78 kg y fue entregada en una sola jornada mediante elevador hidráulico, ya que la vivienda no admite acceso por escalera.",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Roble francés FSC",
      "Fresno macizo",
      "Acero negro forjado",
      "Aceite duro Osmo Polyx",
    ],
    year: 2025,
    client: "Vivienda particular · Aranjuez",
    durationWeeks: 8,
    dimensions: { width: 240, height: 75, depth: 95, unit: "cm" },
    process: [
      {
        phase: "Selección de tablas",
        description:
          "Visita al almacén de maderas en Toledo para escoger tres tablas con veta continua y nudos sanos.",
        weeks: 1,
      },
      {
        phase: "Aclimatación y cepillado",
        description:
          "Seis meses previos en taller a 18 °C y 55 % HR antes del cepillado fino con regruesadora.",
        weeks: 2,
      },
      {
        phase: "Ensamble del tablero",
        description:
          "Trazado de las espigas pasantes de fresno y encolado prensado con sargentos durante 24 h.",
        weeks: 2,
      },
      {
        phase: "Forja y montaje",
        description:
          "Coordinación con el herrero, encaje de las patas y atornillado pasante con tapones torneados.",
        weeks: 2,
      },
      {
        phase: "Acabado y entrega",
        description: "Tres manos de aceite Osmo y entrega con elevador hidráulico.",
        weeks: 1,
      },
    ],
    challenges: [
      "Compensar la contracción transversal del roble en tres tablas de distinta procedencia.",
      "Mantener la planitud del tablero sin recurrir a tirantes metálicos visibles.",
    ],
    techniques: [
      "Espiga pasante de fresno",
      "Soldadura en fragua",
      "Acabado a muñequilla",
    ],
    testimonial: {
      quote:
        "La mesa tiene presencia sin imponerse. Es lo primero que se nota al entrar y lo último que se mira al salir.",
      author: "Marta Solís",
      role: "Propietaria",
    },
    tags: ["FSC", "encargo singular", "comedor"],
    featured: true,
  },
  {
    slug: "reforma-loft-industrial",
    title: "Reforma Loft Industrial",
    category: "Carpintería estructural",
    shortDescription:
      "Estructura de altillo en madera laminada y peldaños en abeto antiguo recuperado.",
    description:
      "Intervención integral sobre una antigua nave de imprenta del barrio de Arganzuela (Madrid) de 110 m² con cuatro metros de altura libre. El proyecto requería ganar una zona de descanso sin perder la lectura industrial del espacio ni cargar visualmente las cerchas Polonceau originales del edificio, que se mantuvieron a la vista tras un decapado por chorro de arena.\n\nLa estructura del altillo se calculó para una sobrecarga de 200 kg/m² y se ejecutó en madera laminada encolada (GL24h) de pino silvestre, con vigas de 200×80 mm apoyadas sobre dos pilares de acero corten anclados al forjado existente mediante placa base y pernos químicos M16. El forjado superior se resolvió con tablero contralaminado CLT de tres capas, dejando vista la cara inferior como falso techo natural.\n\nLos peldaños de la escalera se construyeron a partir de tarima antigua recuperada de una casona manchega en ruinas, cepillada manualmente para conservar las marcas de azuela originales. Cada peldaño se fija mediante un perfil L oculto soldado a la zanca lateral en pletina de acero negro de 15 mm.\n\nEl resultado convive con la memoria del edificio sin pastiche: lo nuevo se reconoce nuevo, y lo viejo se cuida sin mimetizarse.",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Pino laminado GL24h",
      "CLT tres capas",
      "Abeto antiguo recuperado",
      "Acero corten",
      "Aceite cera natural",
    ],
    year: 2024,
    client: "Loft Arganzuela · Madrid",
    durationWeeks: 14,
    dimensions: { width: 6.2, height: 2.4, depth: 4.8, unit: "m" },
    process: [
      {
        phase: "Estudio estructural",
        description:
          "Cálculo de cargas con ingeniería externa y validación de anclajes sobre forjado existente.",
        weeks: 2,
      },
      {
        phase: "Producción en taller",
        description:
          "Mecanizado CNC de las vigas GL24h y preparación de los paneles CLT cortados a medida.",
        weeks: 5,
      },
      {
        phase: "Montaje en obra",
        description:
          "Izado con grúa por la fachada y atornillado sobre los pilares corten ya instalados.",
        weeks: 4,
      },
      {
        phase: "Recuperación de tarima",
        description:
          "Cepillado manual de 24 peldaños conservando las huellas de azuela.",
        weeks: 2,
      },
      {
        phase: "Acabados finales",
        description:
          "Aplicación de cera natural a brocha y ajuste de las uniones acero-madera.",
        weeks: 1,
      },
    ],
    challenges: [
      "Trabajar bajo cerchas históricas sin tocarlas estructuralmente.",
      "Garantizar reacción al fuego R30 sin recurrir a pintura intumescente visible.",
      "Acceso a obra por una sola escalera estrecha: todo el material entró por grúa.",
    ],
    techniques: [
      "Laminado encolado GL24h",
      "Anclaje químico sobre forjado existente",
      "Recuperación de tarima histórica",
    ],
    tags: ["estructural", "rehabilitación", "industrial"],
    featured: true,
  },
  {
    slug: "biblioteca-nogal-suspendida",
    title: "Biblioteca de Nogal Suspendida",
    category: "Muebles a medida",
    shortDescription:
      "Estantería de pared con módulos de nogal americano y soportes ocultos de acero.",
    description:
      "Composición modular pensada para acoger 600 volúmenes en el despacho doméstico de un editor literario. La pared, de 4,2 m de ancho, no admitía suelo apoyado por la presencia de un radiador inferior, así que toda la biblioteca se resolvió con anclaje pasante al muro de carga.\n\nCada balda se talla en una sola pieza de nogal americano de 35 mm seleccionado por su veta cerrada y tono uniforme. Antes del corte definitivo, las tablas se sometieron a una flecha controlada de 4 mm en sentido inverso al previsto, de modo que al cargarlas con libros la curva se anula y la línea horizontal se mantiene perfecta.\n\nLos soportes se fabrican en pletina de acero S275 de 8 mm doblada en L, atornillada al muro con varilla métrica M10 sellada con resina epoxi. Cada soporte queda embebido dentro de la balda en una caja fresada con CNC, de manera que solo asoma la línea de sombra inferior — el efecto desde el salón es de planos de madera flotando sobre el yeso pintado.\n\nLa última balda funciona como repisa de objetos y se inclina ligeramente para acoger libros abiertos en exposición.",
    image:
      "https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Nogal americano",
      "Acero S275 pintado",
      "Varilla roscada M10",
      "Resina epoxi estructural",
      "Cera natural de abeja",
    ],
    year: 2025,
    client: "Despacho profesional · Madrid",
    durationWeeks: 5,
    dimensions: { width: 420, height: 240, depth: 32, unit: "cm" },
    process: [
      {
        phase: "Levantamiento y replanteo",
        description:
          "Detección con escáner de armaduras del muro para definir puntos de anclaje seguros.",
        weeks: 1,
      },
      {
        phase: "Mecanizado de baldas",
        description:
          "Fresado CNC de las cajas internas y cepillado fino del nogal.",
        weeks: 2,
      },
      {
        phase: "Anclaje y montaje",
        description:
          "Taladrado con plantilla milimétrica y sellado con resina epoxi bicomponente.",
        weeks: 1,
      },
      {
        phase: "Acabado in situ",
        description:
          "Aplicación de cera natural a brocha en dos manos con secado intermedio.",
        weeks: 1,
      },
    ],
    challenges: [
      "Anular la flecha estructural con pre-curvado inverso de 4 mm.",
      "Anclar 90 kg de libros sobre tabique sin apoyo en suelo.",
    ],
    techniques: [
      "Fresado CNC para cajas ocultas",
      "Pre-curvado de balda",
      "Anclaje químico sobre muro",
    ],
    testimonial: {
      quote:
        "Tres años después, sigue recta como el primer día. La sutileza del detalle solo se ve cuando ya la has vivido.",
      author: "Eduardo Lerma",
      role: "Editor",
    },
    tags: ["biblioteca", "interior", "encargo singular"],
    featured: true,
  },
  {
    slug: "restauracion-armario-nogal",
    title: "Restauración de Armario de Nogal (1905)",
    category: "Restauración",
    shortDescription:
      "Recuperación integral de un armario ecléctico de nogal de 1905 con marquetería original.",
    description:
      "Pieza familiar firmada por un taller ebanista madrileño en 1905, heredada durante cuatro generaciones. Llegó al taller con tres piezas de marquetería desprendidas, un travesaño inferior comido por carcoma activa y la goma laca original prácticamente desaparecida tras un intento previo de barnizado con tinte.\n\nLa primera fase consistió en un tratamiento curativo de carcoma con permetrina inyectada y posterior cuarentena de seis semanas en cámara seca a 22 °C. Confirmada la erradicación, se procedió al decapado manual de los restos de barniz moderno con muñequilla de alcohol etílico al 96 %, evitando cualquier producto químico agresivo que pudiera dañar la marquetería original de palosanto y limoncillo.\n\nLas tres piezas de marquetería perdidas se reconstruyeron a partir de fotografías de archivo familiar y de un catálogo de la época conservado en el Museo Nacional de Artes Decorativas (Madrid). El palosanto se obtuvo de un piano vertical Erard de 1890 desguazado, garantizando un envejecimiento cromático coherente con el resto del mueble.\n\nEl acabado se devolvió con goma laca aplicada a muñequilla en seis manos, frotando con aceite de linaza entre la cuarta y la quinta para conseguir la profundidad típica del barniz francés. Los herrajes de bronce se limpiaron con bicarbonato y se protegieron con cera microcristalina, conservando la pátina.",
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Palosanto recuperado",
      "Limoncillo",
      "Goma laca rubia",
      "Bronce original",
      "Aceite de linaza",
      "Cera microcristalina",
    ],
    year: 2024,
    client: "Colección privada · Madrid",
    durationWeeks: 12,
    dimensions: { width: 168, height: 220, depth: 58, unit: "cm" },
    process: [
      {
        phase: "Diagnóstico",
        description:
          "Inspección entomológica, fotografía técnica y archivo histórico del taller ebanista original.",
        weeks: 1,
      },
      {
        phase: "Tratamiento curativo",
        description:
          "Inyección de permetrina y cuarentena en cámara seca durante seis semanas.",
        weeks: 6,
      },
      {
        phase: "Decapado y reparación",
        description:
          "Eliminación manual del barniz moderno y consolidación del travesaño inferior.",
        weeks: 2,
      },
      {
        phase: "Reposición de marquetería",
        description:
          "Talla y encolado de tres piezas reconstruidas a partir de archivo fotográfico.",
        weeks: 2,
      },
      {
        phase: "Acabado a muñequilla",
        description:
          "Seis manos de goma laca aplicada a muñequilla con aceite de linaza intermedio.",
        weeks: 1,
      },
    ],
    challenges: [
      "Erradicar carcoma activa sin tratamientos químicos agresivos sobre la marquetería.",
      "Encontrar palosanto envejecido con coherencia cromática (resuelto con un piano Erard de 1890).",
      "Reconstruir tres piezas perdidas sin patrones físicos, solo con archivo fotográfico.",
    ],
    techniques: [
      "Goma laca a muñequilla",
      "Marquetería de palosanto",
      "Tratamiento curativo de carcoma",
      "Limpieza con pátina conservada",
    ],
    testimonial: {
      quote:
        "Mi bisabuelo lo encargó en 1905. No quería verlo nuevo, quería verlo en pie cien años más. Eso es exactamente lo que devolvieron.",
      author: "Clara Heras",
      role: "Cuarta generación familiar",
    },
    tags: ["eclecticismo", "patrimonio", "restauración integral"],
    featured: true,
  },
  {
    slug: "escritorio-fresno-curvo",
    title: "Escritorio de Fresno Curvo",
    category: "Muebles a medida",
    shortDescription:
      "Escritorio de 180 cm con frente curvado mediante laminado al vapor.",
    description:
      "Diseñado para Estudio Marván Arquitectos, en Madrid, que necesitaba una mesa de reuniones de 180 cm que no fuera rectangular ni ovalada, sino con un frente cóncavo hacia el invitado para favorecer la conversación cercana al material y los planos.\n\nEl frente curvado se obtuvo laminando ocho chapas de fresno europeo de 1,5 mm sobre un molde positivo de MDF fresado en CNC con radio constante de 220 cm. Las chapas se encolaron con cola de urea-formaldehído (resistente al cizallamiento) y se prensaron al vacío durante 48 horas en una bolsa de polietileno con bomba de pistón. Tras el desmolde, la pieza mantuvo la curva sin retorno elástico apreciable.\n\nLa superficie superior se trabajó con poliuretano al agua mate de dos componentes (Borma Aqua) aplicado a pistola en tres manos, lijando con grano 320 entre capas. El acabado resiste el café, los rotuladores técnicos y la limpieza con paño húmedo sin alterar el tono blanquecino natural del fresno.\n\nLas patas se resolvieron en acero inoxidable cepillado de 60×20 mm soldado en bisel a 45° para que las aristas queden afiladas, no romas. El conjunto pesa 42 kg y se montó in situ con tres tornillos M8 ocultos por embellecedores torneados en el mismo fresno.",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Fresno europeo",
      "Cola urea-formaldehído",
      "Poliuretano al agua Borma",
      "Acero inoxidable cepillado",
    ],
    year: 2025,
    client: "Estudio Marván Arquitectos · Madrid",
    durationWeeks: 7,
    dimensions: { width: 180, height: 74, depth: 95, unit: "cm" },
    process: [
      {
        phase: "Fresado del molde",
        description:
          "Mecanizado CNC del molde positivo de MDF a radio constante de 220 cm.",
        weeks: 1,
      },
      {
        phase: "Laminado al vacío",
        description:
          "Encolado de ocho chapas de fresno y prensado en bolsa de vacío durante 48 h.",
        weeks: 2,
      },
      {
        phase: "Mecanizado y montaje",
        description:
          "Recorte del frente curvo, ensamble con el tablero plano y atornillado a las patas.",
        weeks: 2,
      },
      {
        phase: "Acabado a pistola",
        description:
          "Tres manos de poliuretano al agua mate aplicado en cabina filtrada.",
        weeks: 2,
      },
    ],
    challenges: [
      "Conseguir un radio constante sin retorno elástico tras el desmolde.",
      "Acabado de alta resistencia sin amarilleamiento sobre fresno claro.",
    ],
    techniques: [
      "Laminado al vacío",
      "Prensado en bolsa",
      "Acabado a pistola en cabina",
    ],
    tags: ["mobiliario contract", "diseño curvo", "oficina"],
  },
  {
    slug: "porche-cedro-vivienda-rural",
    title: "Porche de Cedro · Vivienda Rural",
    category: "Carpintería estructural",
    shortDescription:
      "Estructura cubierta de 36 m² en madera de cedro rojo del oeste americano.",
    description:
      "Porche de gran envergadura para una casa de labor rehabilitada en los Montes de Toledo, orientada a poniente con vistas a la Sierra de San Vicente. El cliente quería un espacio cubierto que respirase la tradición constructiva castellana sin recurrir a pino tratado en autoclave, frecuente pero visualmente plano tras pocos años de uso.\n\nToda la estructura — seis pilares, dos jácenas perimetrales, ocho correas y entrevigado — se ejecutó en cedro rojo del oeste americano (Thuja plicata) por su excepcional resistencia natural a hongos e insectos sin necesidad de tratamientos químicos. El cedro envejece a un gris plateado uniforme que el cliente prefirió deliberadamente sobre cualquier acabado pigmentado.\n\nLos ensambles principales — pilar-jácena y jácena-correa — se resolvieron con caja y espiga reforzada con tarugo de roble pasante, manteniendo la imagen artesanal sin recurrir a herrajes visibles. Solo los anclajes inferiores a la zapata de hormigón llevan placa metálica galvanizada, separada del suelo 3 cm para evitar capilaridad.\n\nLa cubierta se resolvió con teja árabe envejecida recuperada, sobre rastrel de pino tratado y manta impermeable bituminosa autoprotegida. El conjunto se replanteó in situ con plantillas a tamaño real porque el terreno presentaba un desnivel de 18 cm en los 9 m de longitud del porche.",
    image:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Cedro rojo del oeste",
      "Roble (tarugos)",
      "Teja árabe recuperada",
      "Placa galvanizada base",
    ],
    year: 2024,
    client: "Casa de labor rehabilitada · Montes de Toledo",
    durationWeeks: 10,
    dimensions: { width: 9, height: 3.2, depth: 4, unit: "m" },
    process: [
      {
        phase: "Replanteo en obra",
        description:
          "Levantamiento topográfico y plantillas a tamaño real sobre el terreno.",
        weeks: 1,
      },
      {
        phase: "Mecanizado de ensambles",
        description:
          "Trazado y vaciado a mano de cajas y espigas en taller para 14 nudos estructurales.",
        weeks: 3,
      },
      {
        phase: "Montaje estructural",
        description:
          "Izado manual de pilares y jácenas, ajuste fino y atarugado con roble pasante.",
        weeks: 3,
      },
      {
        phase: "Cubierta y acabados",
        description:
          "Colocación de teja árabe recuperada y remate de aleros con escantillones de obra.",
        weeks: 3,
      },
    ],
    challenges: [
      "Resolver un desnivel de 18 cm en 9 m de longitud sin recurrir a cuñas visibles.",
      "Trabajar con cedro sin tratamiento manteniendo durabilidad a 25 años.",
    ],
    techniques: [
      "Caja y espiga reforzada",
      "Atarugado con roble pasante",
      "Replanteo con plantilla a escala real",
    ],
    tags: ["exterior", "rural", "cubierta tradicional"],
  },
  {
    slug: "vitrina-art-deco-vinos",
    title: "Vitrina Art Déco para Colección de Vinos",
    category: "Muebles a medida",
    shortDescription:
      "Vitrina climatizada para 220 botellas con marquetería geométrica en macasar y latón.",
    description:
      "Encargo singular para un coleccionista residente en un cigarral de Toledo. El proyecto requería una vitrina climatizada para 220 botellas en horizontal con frente decorativo y temperatura estable a 13 °C, integrada en el comedor sin aspecto de electrodoméstico.\n\nEl mueble se diseñó como pieza Art Déco contemporánea, recuperando el lenguaje geométrico de los talleres parisinos de los años treinta. El frente se resuelve con marquetería radial de ébano macasar y limoncillo formando un abanico de 27 segmentos, separados por filetes de latón cepillado de 2 mm embebidos en ranura. Las puertas son de vidrio templado bajo en hierro con junta perimetral magnética para garantizar el sellado térmico.\n\nEl interior se forró en sapeli teñido en negro con baldas de roble americano sobre guías de latón macizo, dimensionadas para botellas borgoñonas (Ø 81 mm) con espacio adicional para magnums. El sistema de refrigeración es una unidad pasiva de compresor Eurocave dimensionada para 200 W con disipador en la trasera ventilada por rejilla oculta tras zócalo.\n\nLa pieza se calculó con holgura térmica para mantener 13 °C ± 0,5 °C incluso durante los picos de calor estival de la zona, con humedad relativa estable al 65 % gracias a un humidificador pasivo de bandeja de zinc.",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Ébano macasar",
      "Limoncillo",
      "Latón cepillado",
      "Sapeli teñido",
      "Roble americano",
      "Vidrio templado bajo en hierro",
    ],
    year: 2025,
    client: "Coleccionista privado · Cigarral de Toledo",
    durationWeeks: 16,
    dimensions: { width: 180, height: 200, depth: 62, unit: "cm" },
    process: [
      {
        phase: "Diseño y prototipado",
        description:
          "Maqueta a escala 1:5 y validación del patrón de marquetería con el cliente.",
        weeks: 3,
      },
      {
        phase: "Marquetería",
        description:
          "Corte a sierra de marquetero de 27 segmentos en macasar y limoncillo.",
        weeks: 4,
      },
      {
        phase: "Carcasa y aislamiento",
        description:
          "Construcción de la caja sándwich con aislante PIR y junta perimetral.",
        weeks: 4,
      },
      {
        phase: "Integración del clima",
        description:
          "Instalación de unidad Eurocave, pruebas de estabilidad térmica durante 72 h.",
        weeks: 3,
      },
      {
        phase: "Acabados finales",
        description:
          "Goma laca pulida en frente y montaje del vidrio templado.",
        weeks: 2,
      },
    ],
    challenges: [
      "Combinar estanqueidad térmica con un frente de marquetería que respeta dilatación.",
      "Disipar el calor del compresor sin rejillas visibles en el comedor.",
      "Mantener humedad relativa al 65 % sin equipos activos ruidosos.",
    ],
    techniques: [
      "Marquetería radial",
      "Filete de latón embebido",
      "Goma laca pulida",
      "Sándwich térmico con PIR",
    ],
    testimonial: {
      quote:
        "Imposible saber que dentro hay un compresor. Mis amigos sumilleres pensaban que era un bargueño antiguo restaurado.",
      author: "Ignacio del Valle",
      role: "Coleccionista",
    },
    tags: ["art déco", "marquetería", "encargo singular", "climatización"],
    featured: true,
  },
  {
    slug: "cocina-castano-casona",
    title: "Cocina Rústica de Castaño en Casona",
    category: "Muebles a medida",
    shortDescription:
      "Cocina completa en castaño macizo con encimera de granito flameado y herrajes de hierro forjado.",
    description:
      "Cocina integral de 18 m² para una casona del siglo XVIII rehabilitada en La Sagra. El cliente, restaurador profesional retirado, pidió una cocina de uso real, no de catálogo: que aguantara cuchillos, ollas calientes apoyadas directamente y limpieza con bayeta sin protocolo. Nada de melaminas ni cantos termoplásticos.\n\nLos frentes se ejecutaron en castaño macizo de 22 mm con bastidor ensamblado a inglete reforzado con galleta de haya. El castaño se eligió específicamente por su tonalidad miel oscura y por su comportamiento estable en cocinas con vapor diario, además de su tradición constructiva en casonas castellanas. Las puertas llevan tirador de hierro forjado por un herrero de Yepes, con leve textura de martillo a la vista.\n\nLa encimera principal es de granito gris Quintana flameado de 4 cm sobre frente de madera. Sobre la zona de fogones se incorporó una repisa de roble macizo aceitado con teflón de protección térmica embebido, para apoyar ollas recién sacadas del fuego sin marcar la madera. Los rodapiés son de pizarra negra de Bernardos, fijada con mortero bastardo.\n\nEl conjunto se completa con un fregadero de gres esmaltado de gran formato (90 cm) bajo encimera y grifería de bronce cepillado con mando largo tipo bistró.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Castaño macizo",
      "Haya (galletas)",
      "Granito Quintana flameado",
      "Hierro forjado",
      "Roble aceitado",
      "Pizarra de Bernardos",
    ],
    year: 2024,
    client: "Casona privada · La Sagra",
    durationWeeks: 11,
    dimensions: { width: 5.4, height: 2.6, depth: 0.65, unit: "m" },
    process: [
      {
        phase: "Levantamiento de obra",
        description:
          "Medición de paramentos irregulares con láser y plantillas de cartón.",
        weeks: 1,
      },
      {
        phase: "Producción de muebles",
        description:
          "Mecanizado de bastidores y puertas en castaño con ensamble a inglete.",
        weeks: 5,
      },
      {
        phase: "Encimeras y rodapié",
        description:
          "Coordinación con marmolista y picapedrero para granito y pizarra.",
        weeks: 2,
      },
      {
        phase: "Montaje y forja",
        description:
          "Instalación en obra y colocación de tiradores forjados a mano.",
        weeks: 2,
      },
      {
        phase: "Acabados y ajustes",
        description:
          "Aceitado in situ con tres manos y ajuste fino de bisagras Blum.",
        weeks: 1,
      },
    ],
    challenges: [
      "Adaptar todos los muebles a paramentos irregulares con desplomes de hasta 4 cm.",
      "Integrar electrodomésticos modernos sin frentes visibles en clave rústica.",
      "Conseguir un castaño con coherencia cromática en 14 frentes de gran formato.",
    ],
    techniques: [
      "Ensamble a inglete con galleta",
      "Forja a mano",
      "Aceitado in situ",
    ],
    tags: ["cocina", "rural", "rehabilitación", "encargo singular"],
  },
  {
    slug: "escalera-helicoidal-iroko",
    title: "Escalera Helicoidal de Iroko",
    category: "Carpintería estructural",
    shortDescription:
      "Escalera helicoidal de tres metros de altura con peldaños volados en iroko macizo.",
    description:
      "Pieza vertebradora de una vivienda unifamiliar en Pozuelo de Alarcón, diseñada con el Estudio Marván. La escalera conecta planta baja y primera en un hueco circular de 240 cm de diámetro, salvando 3,20 m de altura con catorce peldaños en hélice de 270°.\n\nLa estructura portante es un alma metálica central de tubo de acero de 220 mm de diámetro y 8 mm de espesor, anclada al forjado inferior con placa base atornillada químicamente. Los peldaños son macizos de iroko africano de 60 mm de espesor, escogido por su excepcional dureza Brinell (4,1 kN/mm²) y su estabilidad dimensional bajo cargas puntuales. Cada peldaño se acopla al alma mediante manguito metálico embebido con tres pernos M12 ocultos bajo tapón de iroko torneado.\n\nLa baranda exterior es un pasamanos continuo de iroko laminado al vapor sobre molde, formando una espiral perfecta sin uniones visibles en sus 7,2 m de desarrollo. Se fabricó en taller en 11 segmentos encolados y se montó en obra mediante andamio interior temporal. Los balaustres son varillas de acero negro mate de 14 mm cada 14 cm, embebidos por arriba en el pasamanos y por abajo en la testa del peldaño.\n\nEl iroko se acabó con dos manos de aceite Rubio Monocoat blanco neutro para preservar el tono cálido sin amarillearlo, y una mano final de cera con grano fino para incrementar la resistencia al pisado en zona de tránsito.",
    image:
      "https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Iroko africano",
      "Acero S275 lacado",
      "Acero negro mate (balaustres)",
      "Aceite Rubio Monocoat",
      "Cera de carnauba",
    ],
    year: 2025,
    client: "Vivienda unifamiliar · Pozuelo de Alarcón",
    durationWeeks: 18,
    dimensions: { width: 240, height: 320, depth: 240, unit: "cm" },
    process: [
      {
        phase: "Cálculo estructural",
        description:
          "Validación con ingeniería externa de la carga puntual sobre peldaño volado.",
        weeks: 2,
      },
      {
        phase: "Fabricación del alma",
        description:
          "Mecanizado del tubo central con los 14 manguitos soldados a la altura exacta.",
        weeks: 3,
      },
      {
        phase: "Peldaños en taller",
        description:
          "Cepillado, perforado y embebido de manguitos en cada peldaño de iroko.",
        weeks: 4,
      },
      {
        phase: "Pasamanos al vapor",
        description:
          "Laminado en taller del pasamanos en 11 segmentos sobre molde helicoidal.",
        weeks: 5,
      },
      {
        phase: "Montaje en obra",
        description:
          "Izado del alma central, atornillado de peldaños y montaje del pasamanos.",
        weeks: 3,
      },
      {
        phase: "Acabados",
        description:
          "Aceitado in situ de peldaños y pasamanos, con cera de carnauba final.",
        weeks: 1,
      },
    ],
    challenges: [
      "Geometría helicoidal sin uniones visibles en el pasamanos de 7,2 m.",
      "Anclaje del alma central capaz de absorber el momento de vuelco con carga descentrada.",
      "Mantener tolerancias de ±1 mm en los manguitos soldados al tubo central.",
    ],
    techniques: [
      "Laminado al vapor sobre molde helicoidal",
      "Soldadura de manguitos a tubo central",
      "Embebido de tapones torneados",
    ],
    testimonial: {
      quote:
        "Subir y bajar es una experiencia. La gente que viene de visita se para a media altura sin saber por qué.",
      author: "Estudio Marván",
      role: "Arquitectura del proyecto",
    },
    tags: ["estructural", "escalera", "encargo singular", "laminado"],
    featured: true,
  },
  {
    slug: "restauracion-puerta-renacentista",
    title: "Restauración de Puerta Renacentista",
    category: "Restauración",
    shortDescription:
      "Recuperación de portón renacentista de nogal del siglo XVI con tallas figurativas.",
    description:
      "Portón principal de un palacio del siglo XVI en el casco histórico de Toledo, declarado Bien de Interés Cultural. La pieza original mide 280×155 cm, está construida en nogal macizo de 50 mm y conserva tallas figurativas atribuidas a un taller toledano del círculo de Alonso de Covarrubias con escenas mitológicas en cuatro plafones rebajados.\n\nLlegó al taller con daños severos por exposición prolongada a la intemperie: agrietamiento del plafón inferior derecho, pérdida de tres tarugos pasantes, oxidación profunda de las cerraduras de hierro originales y desprendimiento de la talla central del plafón superior izquierdo. La intervención se planteó como restauración conservativa pura: mantener todo lo original viable y reponer lo perdido con criterio reconocible (regla de Brandi).\n\nLas grietas del plafón inferior se consolidaron con injerto de nogal antiguo recuperado de una viga de derribo, cosido con espiga de fresno teñido y rematado con goma laca pigmentada. La talla desprendida se reposicionó con resina acrílica reversible Paraloid B-72 al 30 %, dejando una junta visible para distinguir intervención de original.\n\nLos herrajes de hierro forjado se trataron con baño electrolítico controlado por restaurador metalúrgico colaborador, recuperando la cerradura de muelle del XVI funcional. El acabado se devolvió con cera microcristalina aplicada a paño de algodón, evitando barnices que falseasen la pátina centenaria.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    blurDataURL: BLUR,
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    ],
    materials: [
      "Nogal macizo recuperado",
      "Fresno (espigas)",
      "Hierro forjado original",
      "Paraloid B-72",
      "Cera microcristalina",
      "Goma laca pigmentada",
    ],
    year: 2024,
    client: "Palacio protegido · Toledo",
    durationWeeks: 20,
    dimensions: { width: 155, height: 280, depth: 5, unit: "cm" },
    process: [
      {
        phase: "Diagnóstico patrimonial",
        description:
          "Informe técnico para Patrimonio de Castilla-La Mancha y autorización de la intervención.",
        weeks: 3,
      },
      {
        phase: "Desmontaje y traslado",
        description:
          "Retirada controlada del marco y transporte protegido al taller.",
        weeks: 1,
      },
      {
        phase: "Consolidación estructural",
        description:
          "Injertos de nogal recuperado y cosido con espigas de fresno teñido.",
        weeks: 6,
      },
      {
        phase: "Reposición de talla",
        description:
          "Recolocación del fragmento desprendido con Paraloid reversible.",
        weeks: 3,
      },
      {
        phase: "Restauración de herrajes",
        description:
          "Baño electrolítico de cerraduras con restaurador metalúrgico externo.",
        weeks: 4,
      },
      {
        phase: "Acabado y remontaje",
        description:
          "Cera microcristalina y montaje final con asistencia de Patrimonio.",
        weeks: 3,
      },
    ],
    challenges: [
      "Cumplir criterios de reversibilidad exigidos por Patrimonio.",
      "Recuperar la cerradura de muelle del XVI funcional sin sustituir piezas.",
      "Conservar la pátina sin aplicar barnices modernos.",
    ],
    techniques: [
      "Injerto con cosido pasante",
      "Consolidación con Paraloid B-72",
      "Tratamiento electrolítico de hierro forjado",
      "Acabado a cera microcristalina",
    ],
    tags: ["patrimonio", "BIC", "restauración conservativa", "siglo XVI"],
  },
];
