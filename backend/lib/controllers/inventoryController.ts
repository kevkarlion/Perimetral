// backend/lib/controllers/inventoryController.ts
import { NextResponse } from "next/server";
import { InventoryOverviewService } from "@/backend/lib/services/InventoryOverviewService";

export class InventoryController {
  static async overview() {
    const data = await InventoryOverviewService.getOverview();
    return NextResponse.json(data);
  }
}
