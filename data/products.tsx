export const productos = [
  {
    id: 1,
    nombre: "Alambrado Perimetral Galvanizado",
    descripcionCorta: "Solución duradera para cerramientos de alta seguridad",
    descripcionLarga: "Alambrado de alta calidad con protección galvanizada para mayor durabilidad contra condiciones climáticas...",
    categoria: "Alambrados",
    imagen: "alambrado.jpg",
    imagenes: [
      { src: '/Productos/alambrado/a1.webp', alt: 'Alambrado vista frontal' },
      { src: '/Productos/alambrado/a5.webp', alt: 'Alambrado vista frontal' },
      { src: '/Productos/alambrado/alambre-arbol1.webp', alt: 'Alambrado vista frontal' },
      { src: '/Productos/alambrado/alambre-arbol2.webp', alt: 'Alambrado vista frontal' },
      { src: '/Productos/alambrado/alambre-planta3.webp', alt: 'Alambrado vista frontal' },
      { src: '/Productos/alambrado/alambre-pre.webp', alt: 'Alambrado vista frontal' },
    ],
    imagenesAdicionales: ["alambrado-2.jpg", "alambrado-3.jpg"],
    precio: "$80.000 + IVA",
    destacado: true,
    especificaciones: [
      "Medidas: 1.50×10 m | 1.80×10 m | 2×10 m",
      "Material: Acero galvanizado",
      "Resistencia: Alta tensión",
      "Vida útil: 15+ años"
    ],
    caracteristicas: [
      "Resistente a la corrosión",
      "Fácil instalación",
      "Bajo mantenimiento"
    ]
  },
  {
    id: 2,
    nombre: "Alambre de Púas ",
    descripcionCorta: "Sistema de seguridad perimetral de alta disuasión",
    descripcionLarga: "Alambrado de alta calidad con protección galvanizada para mayor durabilidad contra condiciones climáticas...",
    categoria: "Seguridad",
    imagen: "concertina.jpg",
    imagenes: [
      { src: '/Productos/puas/pua1.webp', alt: 'Alambrado vista frontal' },
      { src: '/Productos/puas/pua2.webp', alt: 'Alambrado vista frontal' },
      { src: '/Productos/puas/pua-planta1.webp', alt: 'Alambrado vista frontal' },
    ],
    imagenesAdicionales: ["alambrado-2.jpg", "alambrado-3.jpg"],
    precio: "$180.000/m lineal + IVA",
    destacado: false,
    especificaciones: [
      "Altura estándar: 1.80 metros (personalizable)",
      "Longitud por rollo: 50 metros lineales",
      "Material: Acero de alto carbono galvanizado G-90",
      "Diámetro del alambre: 2.5 mm (calibre 12)",
      "Distancia entre púas: 10 cm",
      "Resistencia a la tracción: 1,370 MPa mínimo",
      "Carga de rotura: 500-700 kg/cm²",
      "Postes incluidos cada 2.5 metros",
      "Vida útil: 15+ años en condiciones normales",
      "Garantía: 5 años contra defectos",
      "Certificaciones: ISO 9001, ASTM A121",
      "Peso por rollo: 25 kg aprox."
    ],
    caracteristicas: [
      "Resistente a la corrosión",
      "Fácil instalación",
      "Bajo mantenimiento"
    ]
  },
  {
  id: 3,
  nombre: "Alambre de Alta Resistencia",
  descripcionCorta: "Solución perimetral de máxima durabilidad y tensión",
  descripcionLarga: "Alambre galvanizado de alta resistencia especialmente diseñado para cerramientos de larga duración, con protección contra corrosión y mayor capacidad de tensión que alambres convencionales.",
  categoria: "Cerramientos",
  imagen: "alambre-alta-resistencia.jpg",
  imagenes: [
    { src: '/Productos/resistencia/resistencia.webp', alt: 'Alambre de alta resistencia instalado' },
    { src: '/Productos/resistencia/resistencia1.webp', alt: 'Detalle del alambre' }
  ],
  precio: "$95.000/m lineal + IVA",
  destacado: true,
  especificaciones: [
    "Diámetro: 2.7 mm (calibre 11)",
    "Resistencia a la tracción: 1,500 MPa",
    "Material: Acero de alto carbono galvanizado clase G-90",
    "Elongación: 3-5%",
    "Peso por metro: 0.45 kg",
    "Presentación: Rollos de 500 metros",
    "Tensión máxima recomendada: 800 kg",
    "Vida útil estimada: 20+ años",
    "Temperatura de trabajo: -30°C a 60°C",
    "Garantía: 7 años contra corrosión",
    "Certificaciones: ISO 9001, ASTM A641",
    "Compatibilidad: Para uso con postes de acero u hormigón"
  ],
  caracteristicas: [
    "Mayor vida útil que alambres convencionales",
    "Mínima elongación bajo tensión",
    "Resistencia superior a impactos",
    "Protección galvanizada por inmersión en caliente",
    "Mantenimiento casi nulo"
  ],
  aplicaciones: [
    "Cerramientos ganaderos",
    "Protección de cultivos",
    "Cercados industriales",
    "Delimitación de terrenos"
  ]
},
  {
  id: 4,
  nombre: "Postes Premoldeados de Hormigón",
  descripcionCorta: "Estructuras de soporte de máxima durabilidad para cerramientos",
  descripcionLarga: "Postes fabricados en hormigón armado de alta resistencia, premoldeados bajo estrictos controles de calidad para garantizar durabilidad y estabilidad en todo tipo de terrenos y condiciones climáticas.",
  categoria: "Estructuras",
  imagen: "postes-hormigon.jpg",
  imagenes: [
    { src: '/Productos/pre/pre1.webp', alt: 'Poste premoldeado estándar' },
    { src: '/Productos/pre/pre2.webp', alt: 'Detalle de la base' },
    { src: '/Productos/pre/pre3.webp', alt: 'Instalación en terreno' },
    { src: '/Productos/pre/pre4.webp', alt: 'Postes esquineros' }
  ],
  precio: "$120.000 unidad + IVA",
  destacado: true,
  especificaciones: [
    "Alturas disponibles: 1.8m, 2.1m, 2.4m",
    "Sección: 12x12 cm (estándar)",
    "Resistencia a compresión: 25 MPa",
    "Refuerzo interno: 4 varillas de acero de 6mm",
    "Peso por unidad: 85-110 kg (según altura)",
    "Profundidad de enterrado recomendada: 60 cm",
    "Carga máxima soportada: 1,200 kg",
    "Hormigón: H-25 con aditivos impermeabilizantes",
    "Incluye orificios para alambre cada 20 cm",
    "Vida útil estimada: 30+ años",
    "Garantía: 10 años contra defectos de fabricación",
    "Certificaciones: ISO 9001, IRAM 1548"
  ],
  caracteristicas: [
    "No requiere mantenimiento",
    "Inmunes a plagas (termitas, roedores)",
    "Resistentes a incendios",
    "Estabilidad en todo tipo de suelos",
    "No se oxidan ni corroen"
  ],
  tipos: [
    {
      nombre: "Estándar",
      descripcion: "Para terrenos planos o con pendientes leves"
    },
    {
      nombre: "Esquinero reforzado",
      descripcion: "Doble refuerzo para puntos de tensión"
    },
    {
      nombre: "Con base ampliada",
      descripcion: "Para suelos blandos o con alta humedad"
    }
  ],
  accesoriosIncluidos: [
    "Tapa protectora superior",
    "Grapas de fijación para alambre",
    "Guía de instalación"
  ]
}
  // ... más productos
];