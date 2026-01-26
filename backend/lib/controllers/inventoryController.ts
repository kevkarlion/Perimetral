// backend/lib/controllers/inventoryController.ts
import { NextResponse } from "next/server";
import { InventoryOverviewService } from "@/backend/lib/services/InventoryOverviewService";

export class InventoryController {
  static async overview() {
    const data = await InventoryOverviewService.getOverview();
    return NextResponse.json(data);
  }
  async getOverviewTable(req: Request) {
  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 20)
  const search = searchParams.get("search") || undefined
  const alerta =
    searchParams.get("alerta") === "true"
      ? true
      : searchParams.get("alerta") === "false"
      ? false
      : undefined

  const result = await InventoryOverviewService.getOverviewTable({
    page,
    limit,
    search,
    alerta,
  })

  return NextResponse.json(result)
}


}
