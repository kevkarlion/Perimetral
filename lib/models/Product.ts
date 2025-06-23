import { Schema, model, Document } from 'mongoose';

// Interface para TypeScript
export interface IProductImage {
  src: string;
  alt: string;
}

export interface IVariation {
  medida: string;
  precio: string;
  stock?: number; // 👈 Nuevo: Stock por variación (opcional)
}

export interface IProduct extends Document {
  id: number;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string;
  categoria: string;
  imagen: string;
  imagenes: IProductImage[];
  imagenesAdicionales?: string[];
  precio: string;
  tieneVariaciones: boolean;
  variaciones?: IVariation[];
  destacado: boolean;
  especificaciones: string[];
  caracteristicas: string[];
  stock: number; // 👈 Nuevo: Stock general (permite negativos)
  stockMinimo: number; // 👈 Nuevo: Para alertas
  historialStock: { // 👈 Nuevo: Registro de cambios
    fecha: Date;
    cantidad: number;
    motivo: 'venta' | 'reposicion' | 'ajuste';
    ordenId?: Schema.Types.ObjectId; // Añadido para referencia
  }[];
  estadoStock: string; // 👈 Añade este campo
}

const ProductSchema = new Schema<IProduct>({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true, trim: true },
  descripcionCorta: { type: String, required: true },
  descripcionLarga: { type: String, required: true },
  categoria: { 
    type: String, 
    required: true, 
    enum: ['Alambrados', 'Postes', 'Accesorios'] 
  },
  imagen: { type: String, required: true },
  imagenes: [{
    src: { type: String, required: true },
    alt: { type: String, required: true }
  }],
  imagenesAdicionales: [{ type: String }],
  precio: { type: String, required: true },
  tieneVariaciones: { type: Boolean, default: false },
  variaciones: [{ 
    medida: { type: String, required: true },
    precio: { type: String, required: true },
    stock: { type: Number, default: 0 } // 👈 Stock por variación
  }],
  destacado: { type: Boolean, default: false },
  especificaciones: [{ type: String, required: true }],
  caracteristicas: [{ type: String, required: true }],
  // 👇 Nuevos campos para gestión de stock
  stock: { 
    type: Number, 
    required: true, 
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'El stock debe ser un número entero'
    }
  },
  stockMinimo: { 
    type: Number, 
    default: 3, // 👈 Alerta cuando el stock sea menor a este valor
    min: 0
  },
  historialStock: [{
    fecha: { type: Date, default: Date.now },
    cantidad: { type: Number, required: true },
    motivo: { 
      type: String, 
      required: true,
      enum: ['venta', 'reposicion', 'ajuste'] 
    }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },  // 👈 Necesario para que se incluya en las respuestas
  toObject: { virtuals: true } // 👈 Necesario para acceder en código
});
// Definición del virtual correctamente tipado
ProductSchema.virtual('estadoStock').get(function(this: IProduct) {
  if (this.stock < 0) return 'backorder';
  if (this.stock < this.stockMinimo) return 'bajo';
  return 'ok';
});

// 👇 Actualiza el historial al modificar el stock
ProductSchema.pre('save', function(next) {
  if (this.isModified('stock')) {
    this.historialStock.push({
      fecha: new Date(),
      cantidad: this.stock,
      motivo: 'ajuste' // Se puede ajustar según el contexto
    });
  }
  next();
});

export default model<IProduct>('Product', ProductSchema);