// src/types/mercadoPagoTypes.ts

export interface MercadoPagoItem {
  id: string;
  title?: string;
  description?: string;
  quantity: number;
  unit_price: number;
  variation_id?: string;
  category_id?: string;
}

export interface MercadoPagoPayer {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: {
    number?: string;
  };
}

export interface MercadoPagoAdditionalInfo {
  reference?: string; // Contiene tu orderId
  items?: MercadoPagoItem[];
  payer?: MercadoPagoPayer;
}

export interface MercadoPagoPayment {
  id: number;
  status: string;
  status_detail?: string;
  transaction_amount: number;
  date_approved?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  additional_info?: MercadoPagoAdditionalInfo;
}

export interface StockUpdateResult {
  productId: string;
  variationId?: string;
  success: boolean;
  newStock?: number;
  error?: string;
}

export interface WebhookResponse {
  success: boolean;
  orderId?: string;
  stockUpdates?: StockUpdateResult[];
  error?: string;
  details?: any;
}