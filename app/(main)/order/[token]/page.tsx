// app/order/[token]/page.tsx
import OrderDetails from '@/app/components/OrderDetails/OrderDetails';

export default function OrderPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="container mx-auto py-8">
      <OrderDetails token={params.token} />
    </div>
  );
}