"use client";
import { useState, useEffect } from "react";
import CategoryList from "./CategoryAdminPanel";
import ProductList from "./ProductList";
import VariationList from "./VariationList";
import { useProductStore } from "../../store/product-store";
import { useVariationStore } from "../../store/variation-store";
import { IVariation } from "@/types/ProductFormData";
import CategoryAdminPanel from "./CategoryAdminPanel";
import CategoryManagementPanel from "./CategoryManagementPanel";

export default function CatalogTab() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const [selectedVariation, setSelectedVariation] = useState<IVariation | null>(
    null,
  );
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);

  const { products } = useProductStore();
  const {
    variations,
    loading: loadingVariations,
    error: variationError,
    fetchByProduct,
    clear,
  } = useVariationStore();

  // 🔁 cada vez que cambia el producto → buscamos sus variaciones reales
  useEffect(() => {
    if (selectedProduct) {
      fetchByProduct(selectedProduct);
    } else {
      clear();
    }
  }, [selectedProduct]);

  // const selectedProductData = products.find(
  //   (p) => p._id === selectedProduct,
  // );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        Catálogo
        {selectedCategory && ` > Categoría`}
        {selectedProduct && ` > Producto`}
      </div>

      {/* Categorías */}
      <CategoryManagementPanel
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          setSelectedProduct(null);
        }}
      />

      {/* Productos */}
      {selectedCategory && (
        <ProductList
          categoryId={selectedCategory}
          selectedProductId={selectedProduct}
          onSelectProduct={(id) => setSelectedProduct(id)}
        />
      )}

      {/* Variaciones reales */}
      {selectedProduct && (
        <>
          {loadingVariations && <p>Cargando variaciones...</p>}
          {variationError && <p className="text-red-500">{variationError}</p>}

          <VariationList
            variations={variations}
            onEditVariation={(v) => {
              setSelectedVariation(v);
              setIsVariationModalOpen(true);
            }}
            onDeleteVariation={(id) => {
              if (!id) return;
              console.log("Eliminar variación", id);
            }}
          />
        </>
      )}
    </div>
  );
}
