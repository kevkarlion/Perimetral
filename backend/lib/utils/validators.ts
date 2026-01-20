// utils/validators.ts
import { ProductFormData, VariationFormData } from "@/types/productTypes";

export function validateProductData(body: ProductFormData): string | null {
  if (!body.nombre || body.nombre.trim() === "") {
    return "El nombre del producto es requerido";
  }

  if (!body.codigoPrincipal || body.codigoPrincipal.trim() === "") {
    return "El código principal es requerido";
  }

  if (!body.categoria || body.categoria.trim() === "") {
    return "La categoría es requerida";
  }

  if (!body.descripcionCorta || body.descripcionCorta.trim() === "") {
    return "La descripción corta es requerida";
  }

  if (body.tieneVariaciones && (!body.variaciones || body.variaciones.length === 0)) {
    return "Los productos con variaciones deben tener al menos una variación";
  }

  if (!body.tieneVariaciones) {
    if (body.precio === undefined || body.precio <= 0) {
      return "El precio es obligatorio y debe ser mayor a 0";
    }
    if (body.stock === undefined || body.stock < 0) {
      return "El stock es obligatorio y no puede ser negativo";
    }
  }

  return null;
}

export function validateVariations(variations: VariationFormData[]): string | null {
  if (!Array.isArray(variations)) {
    return "Las variaciones deben ser un array";
  }

  for (const v of variations) {
    if (!v.nombre || v.nombre.trim() === "") {
      return "Cada variación debe tener un nombre válido";
    }
    if (v.precio === undefined || v.precio < 0) {
      return "Cada variación debe tener un precio válido";
    }
    if (v.stock === undefined || v.stock < 0) {
      return "Cada variación debe tener un stock válido";
    }
    if (!v.imagenes || v.imagenes.length === 0) {
      return "Cada variación debe tener al menos una imagen";
    }
  }

  return null;
}
