import 'dotenv/config'; // ✅ Esto carga automáticamente el archivo .env

import { dbConnect } from '../lib/dbConnect/dbConnect.js';


// Update the import path to the correct relative location of Product
import Product from '../lib/models/Product.js';

const products = [
  {
    id: 1,
    nombre: 'Tejido Romboidal Calibre 14',
    descripcionCorta: "Cercado de alta seguridad",
    descripcionLarga: "Material galvanizado...",
    categoria: "Alambrados",
    imagen: "/productos/alambrado.jpg",
    imagenes: [
      { src: '/productos/alambrado1.webp', alt: 'Vista frontal' }
    ],
    precio: "Desde $65.000",
    stock: 50,
    stockMinimo: 5,
    tieneVariaciones: true,
    variaciones: [
      { medida: "1.50 × 10m", precio: "$65.000", stock: 20 },
      { medida: "1.80 × 10m", precio: "$80.000", stock: 15 }
    ],
    destacado: true,
    especificaciones: ["Material: Acero galvanizado"],
    caracteristicas: ["Resistente a la corrosión"]
  }
  // Añade más productos según necesites
];

async function seedDB() {
  try {
    await dbConnect();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ Productos cargados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cargar productos:', error);
    process.exit(1);
  }
}

seedDB();