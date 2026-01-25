import Categoria from "@/backend/lib/models/Categoria";
import Product from "@/backend/lib/models/Product";
import Variation from "@/backend/lib/models/VariationModel";
import {
  LeanCategoria,
  LeanProduct,
  LeanVariation,
  InventoryOverviewDTO,
} from "@/types/inventoryServices";

export class InventoryOverviewService {
  static async getOverview(): Promise<InventoryOverviewDTO[]> {

    const categorias = await Categoria.find().lean<LeanCategoria[]>();

    const products = await Product.find()
      .populate("categoria", "nombre")
      .lean<LeanProduct[]>();

    const variations = await Variation.find({ activo: true })
      .lean<LeanVariation[]>();

    /* =========================
       Agrupar variaciones
    ========================== */

    const variationsByProduct: Record<
      string,
      InventoryOverviewDTO["productos"][0]["variaciones"]
    > = {};

    for (const v of variations) {
      const pid = v.product.toString();

      if (!variationsByProduct[pid]) variationsByProduct[pid] = [];

      variationsByProduct[pid].push({
        _id: v._id.toString(),
        nombre: v.nombre,
        medida: v.medida,
        stock: v.stock,
        stockMinimo: v.stockMinimo,
        precio: v.precio,
        alerta: v.stock <= v.stockMinimo,
      });
    }

    /* =========================
       Agrupar productos
    ========================== */

    const productsByCategory: Record<
      string,
      InventoryOverviewDTO["productos"]
    > = {};

    for (const p of products) {

      // 🟡 producto sin categoría (data rota)
      if (!p.categoria) {
        const cid = "sin-categoria";

        if (!productsByCategory[cid]) productsByCategory[cid] = [];

        productsByCategory[cid].push({
          _id: p._id.toString(),
          nombre: p.nombre,
          codigoPrincipal: p.codigoPrincipal,
          variaciones: variationsByProduct[p._id.toString()] || [],
        });

        continue;
      }

      const cid = p.categoria._id.toString();

      if (!productsByCategory[cid]) productsByCategory[cid] = [];

      productsByCategory[cid].push({
        _id: p._id.toString(),
        nombre: p.nombre,
        codigoPrincipal: p.codigoPrincipal,
        variaciones: variationsByProduct[p._id.toString()] || [],
      });
    }

    /* =========================
       Armar respuesta final
    ========================== */

    const result: InventoryOverviewDTO[] = categorias.map((cat) => ({
      _id: cat._id.toString(),
      nombre: cat.nombre,
      productos: productsByCategory[cat._id.toString()] || [],
    }));

    // Agregar bucket de huérfanos si existen
    if (productsByCategory["sin-categoria"]) {
      result.push({
        _id: "sin-categoria",
        nombre: "Sin categoría",
        productos: productsByCategory["sin-categoria"],
      });
    }

    return result;
  }
}
