// import 'dotenv/config'; // ✅ Esto carga automáticamente el archivo .env
// import { dbConnect } from '../backend/lib/dbConnect/dbConnect.js';
// import Product from '../lib/models/Product.js';

// const products = [
//   {
//     nombre: 'Tejido Romboidal Calibre 14 - Rombo 2" - Calidad Acindar',
//     descripcionCorta: "Solución duradera para cerramientos de alta seguridad",
//     descripcionLarga: "Alambrado de alta calidad con protección galvanizada para mayor durabilidad contra condiciones climáticas.",
//     categoria: "Alambrados",
//     imagen: "alambrado.jpg",
//     imagenes: [
//       { src: '/Productos/alambrado/a1.webp', alt: 'Alambrado vista frontal' },
//       { src: '/Productos/alambrado/a5.webp', alt: 'Alambrado vista frontal' },
//       { src: '/Productos/alambrado/alambre-arbol1.webp', alt: 'Alambrado vista frontal' },
//       { src: '/Productos/alambrado/alambre-arbol2.webp', alt: 'Alambrado vista frontal' },
//       { src: '/Productos/alambrado/alambre-planta3.webp', alt: 'Alambrado vista frontal' },
//       { src: '/Productos/alambrado/alambrado-instalacion-cancha.webp', alt: 'Alambrado principal' },
//       { src: '/Productos/alambrado/alambre-pre.webp', alt: 'Alambrado vista frontal' },
//     ],
//     precio: "Desde $65.000",
//     tieneVariaciones: true,
//     variaciones: [
//       { medida: "1.50m × 10 m", precio: "65000" },
//       { medida: "1.80m × 10 m", precio: "80000" },
//       { medida: "2.00m × 10 m", precio: "98500" }
//     ],
//     destacado: true,
//     especificaciones: [
//       
//       "Material: Acero galvanizado",
//       "Mantenimiento: Mínimo",
//       "Dificultad de instalación: Fácil,
//          "Garantía: 6 Meses",
//     ],
//     caracteristicas: [
//       "Resistente a la corrosión",
//       "Fácil instalación",
//       "Bajo mantenimiento"
//     ]
//   },
//   {
//     nombre: "Alambre de Púas Bagual",
//     descripcionCorta: "Sistema de seguridad perimetral de alta disuasión",
//     descripcionLarga: "Alambrado de alta calidad con protección galvanizada para mayor durabilidad contra condiciones climáticas...",
//     categoria: "Seguridad",
//     imagen: "concertina.jpg",
//     imagenes: [
//       { src: '/Productos/puas/pua1.webp', alt: 'Alambrado vista frontal' },
//       { src: '/Productos/puas/alambre-instalado.webp', alt: 'Alambrado vista frontal' },
//       { src: '/Productos/puas/pua-planta1.webp', alt: 'Alambrado vista frontal' },
//     ],
//     precio: "$365/mt.",
//     destacado: false,
//     especificaciones: [
//       "5 pulgadas 16-127",
//       "Material: Acero de galvanizado",
//       "Vida útil: 15+ años en condiciones normales",
//       "Garantía: 6 Meses",
//     ],
//     caracteristicas: [
//       "Resistente a la corrosión",
//       "Fácil instalación",
//       "Bajo mantenimiento"
//     ]
//   },
//   {
//     nombre: "Alambre de Alta Resistencia INVENCIBLE",
//     descripcionCorta: "Solución perimetral de máxima durabilidad y tensión",
//     descripcionLarga: "Alambre galvanizado de alta resistencia especialmente diseñado para cerramientos de larga duración, con protección contra corrosión y mayor capacidad de tensión que alambres convencionales.",
//     categoria: "Cerramientos",
//     imagen: "alambre-alta-resistencia.jpg",
//     imagenes: [
//       { src: '/Productos/resistencia/resistencia.webp', alt: 'Alambre de alta resistencia instalado' },
//       { src: '/Productos/resistencia/resistencia1.webp', alt: 'Detalle del alambre' },
//       { src: '/Productos/resistencia/instacion-resitencia.webp', alt: 'Detalle del alambre' }
//     ],
//     precio: "$260/ mt.",
//     destacado: true,
//     especificaciones: [
//       "Diámetro: 16/14",
//       "Resistencia a la tracción: 1,500 MPa",
//       "Material: Acero de alto carbono galvanizado clase G-90",
//       "Tensión máxima recomendada: 800 kg",
//       "Vida útil estimada: 20+ años",
//       "Temperatura de trabajo: -30°C a 60°C",
//       "Garantía: 6 Meses",
//       "Compatibilidad: Para uso con postes de acero, hormigón y madera"
//     ],
//     caracteristicas: [
//       "Mayor vida útil que alambres convencionales",
//       "Mínima elongación bajo tensión",
//       "Resistencia superior a impactos",
//       "Protección galvanizada por inmersión en caliente",
//       "Mantenimiento casi nulo"
//     ],
//     aplicaciones: [
//       "Cerramientos ganaderos",
//       "Protección de cultivos",
//       "Cercados industriales",
//       "Delimitación de terrenos"
//     ]
//   },
//   {
//     nombre: "Postes Premoldeados de Hormigón",
//     descripcionCorta: "Estructuras de soporte de máxima durabilidad para cerramientos",
//     descripcionLarga: "Postes fabricados en hormigón armado de alta resistencia, premoldeados bajo estrictos controles de calidad para garantizar durabilidad y estabilidad en todo tipo de terrenos y condiciones climáticas.",
//     categoria: "Estructuras",
//     imagen: "postes-hormigon.jpg",
//     imagenes: [
//       { src: '/Productos/pre/pre1.webp', alt: 'Poste premoldeado estándar' },
//       { src: '/Productos/pre/pre2.webp', alt: 'Detalle de la base' },
//       { src: '/Productos/pre/poste-hormigon.webp', alt: 'Instalación en terreno' },
//       { src: '/Productos/pre/pre4.webp', alt: 'Postes esquineros' }
//     ],
//     precio: "Desde $27.500",
//     tieneVariaciones: true,
//     variaciones: [
//       { medida: "Esquinero", precio: "$56.000" },
//       { medida: "Rompe tramo", precio: "$55.500" },
//       { medida: "Intermedio Olimpico", precio: "$41.600" },
//       { medida: "Puntal", precio: "$27.500" }
//     ],
//     destacado: true,
//     especificaciones: [
//       "Refuerzo interno: 4 varillas de acero de 6 a 8 mm",
//       "Peso por unidad: 85-110 kg (según altura)",
//       "Profundidad de enterrado recomendada: 60 cm",
//       "Carga máxima soportada: 1,200 kg",
//       "Hormigón: H-25 con aditivos impermeabilizantes",
//       "Incluye orificios para alambre",
//       "Vida útil estimada: 30+ años",
//       "Garantía: 6 meses",
//     ],
//     caracteristicas: [
//       "No requiere mantenimiento",
//       "Inmunes a plagas (termitas, roedores)",
//       "Resistentes a incendios",
//       "Estabilidad en todo tipo de suelos",
//       "No se oxidan ni corroen"
//     ],
//     tipos: [
//       {
//         nombre: "Estándar",
//         descripcion: "Para terrenos planos o con pendientes leves"
//       },
//       {
//         nombre: "Esquinero reforzado",
//         descripcion: "Doble refuerzo para puntos de tensión"
//       },
//       {
//         nombre: "Con base ampliada",
//         descripcion: "Para suelos blandos o con alta humedad"
//       }
//     ]
//   },
//   {
//     nombre: "Ganchos J Galvanizados",
//     descripcionCorta: "Sujeción profesional para cercos de alambre tensado",
//     descripcionLarga: "Ganchos tipo J fabricados en acero de alta resistencia con triple capa de galvanizado para fijación segura de alambres en postes de hormigón, madera o metal. Diseño ergonómico que facilita la instalación.",
//     categoria: "Accesorios para Cerramientos",
//     imagen: "ganchos-j-premium.jpg",
//     imagenes: [
//       { src: '/Productos/accesorios/ganchos.webp', alt: 'Gancho J vista frontal' },
//     ],
//     precio: "$1160 c/u",
//     destacado: true,
//     especificaciones: [
//       "Diámetro: 5/16\" (8 mm)",
//       "Longitud total: 4\" (10 cm)",
//       "Material: Acero SAE 1010 galvanizado",
//       "Capacidad de carga: 200 kg",
//       "Protección: Galvanizado clase G-90",
//       "Incluye: Arandela de seguridad",
//       "Garantía: 6 meses",
//       "Compatibilidad: Para alambres de 12 a 14 1/2"
//     ],
//     caracteristicas: [
//       "Punta reforzada para mayor durabilidad",
//       "Diseño antideslizante",
//       "Resistente a la corrosión salina",
//       "No requiere herramientas especiales para instalación",
//       "Embalaje en bolsas selladas contra humedad"
//     ],
//     aplicaciones: [
//       "Instalación de cercos ganaderos",
//       "Sujeción de alambres en viñedos",
//       "Cerramientos industriales",
//       "Reparación de cercos existentes"
//     ]
//   },
//   {
//     nombre: "Tensor Profesional",
//     descripcionCorta: "Sistema de tensado para cercos de alta exigencia",
//     descripcionLarga: "Tensor metálico profesional con mecanismo de rosca gruesa para tensado preciso de alambres en cercos perimetrales. Fabricado en acero carbono con protección anticorrosiva para uso en exteriores.",
//     categoria: "Sistemas de Tensado",
//     imagen: "tensor-heavy-duty.jpg",
//     imagenes: [
//       { src: '/Productos/accesorios/tensor.webp', alt: 'Tensor profesional vista completa' },
//     ],
//     precio: "$2.195 c/u",
//     destacado: true,
//     especificaciones: [
//       "Rango de alambre: 1/8\" a 5/16\" (3-8 mm)",
//       "Material: Acero carbono galvanizado",
//       "Garantía: 6 meses",
//     ],
//     caracteristicas: [
//       "Mecanismo de tensado de alta precisión",
//       "Doble sistema de seguridad (tuerca + arandela)",
//       "Resistente a condiciones climáticas extremas",
//       "Superficie estriada antideslizante",
//       "Compatibilidad con tensores eléctricos"
//     ],
//     aplicaciones: [
//       "Cerramientos de seguridad",
//       "Cercos para ganado mayor",
//       "Protección perimetral industrial",
//       "Instalaciones en zonas costeras",
//       "Viñedos y cultivos de alto valor"
//     ]
//   }
// ];

// async function seedDB() {
//   try {
//     await dbConnect();
//     await Product.deleteMany({});
//     await Product.insertMany(products);
//     console.log('✅ Productos cargados exitosamente');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error al cargar productos:', error);
//     process.exit(1);
//   }
// }

// seedDB();