// app/order/[token]/page.tsx
import OrderDetails from '@/app/components/OrderDetails/OrderDetails';

interface OrderPageProps {
  params: Promise<{ token: string }>; // 👈 Ahora es Promise
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { token } = await params; // 👈 await antes de usar token

  return (
    <div className="container mx-auto pb-8 pt-12 sm:py-8 sm:pb-8">
      <OrderDetails token={token} />
    </div>
  );
}
