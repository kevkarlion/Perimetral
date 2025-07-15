export interface MercadoPagoPreference {
  id: string;
  init_point?: string;
  sandbox_init_point?: string;
  items: Array<{
    id?: string;
    title: string;
    quantity: number;
    unit_price: number;
    picture_url?: string;
  }>;
  payer?: {
    name?: string;
    email?: string;
    phone?: {
      number?: string;
    };
  };
  external_reference?: string;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  notification_url?: string;
  auto_return?: 'approved' | 'all';
}

export interface MercadoPagoPaymentResponse {
  status: string;
  status_detail: string;
  id: string;
  date_approved?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  order?: {
    id: string;
  };
}