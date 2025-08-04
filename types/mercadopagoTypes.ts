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

export interface MercadoPagoAdditionalInfo {
  items?: MercadoPagoItem[];
  reference?: string; // Contiene el orderId de tu sistema
  payer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: {
      number?: string;
    };
  };
}

// src/types/mercadoPagoTypes.ts
export interface MercadoPagoPayment {
  id: number; // Cambiado a number para coincidir con el SDK
  status: string;
  status_detail?: string;
  transaction_amount: number;
  date_approved?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  additional_info?: MercadoPagoAdditionalInfo;
  [key: string]: any; // Para propiedades adicionales del SDK
}

export interface WebhookResponse {
  success: boolean;
  orderId?: string;
  stockUpdates?: Array<{
    productId: string;
    success: boolean;
    data?: any;
    error?: string;
  }>;
  error?: string;
  details?: any;
}