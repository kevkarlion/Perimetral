// src/lib/models/Categoria.ts
import { Schema, model, models } from 'mongoose';
import { ICategoria } from '@/types/categoria';

const CategoriaSchema = new Schema<ICategoria>({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es requerido'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para generar el slug antes de guardar
CategoriaSchema.pre<ICategoria>('save', function(next) {
  if (!this.slug) {
    this.slug = this.nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

export default models?.Categoria || model<ICategoria>('Categoria', CategoriaSchema);