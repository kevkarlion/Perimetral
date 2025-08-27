'use client'
import { IStockMovement } from '@/types/stockTypes'

export default function StockMovementsTable({ movements }: { movements: IStockMovement[] }) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Fecha</th>
          <th className="border p-2">Producto</th>
          <th className="border p-2">Tipo</th>
          <th className="border p-2">Cantidad</th>
          <th className="border p-2">Stock Anterior</th>
          <th className="border p-2">Stock Nuevo</th>
          <th className="border p-2">Razón</th>
        </tr>
      </thead>
      <tbody>
        {movements.map(m => (
          <tr key={m._id.toString()}>
            <td className="border p-2">{new Date(m.createdAt).toLocaleString()}</td>
            <td className="border p-2">{typeof m.productId === 'object' ? (m.productId as any).nombre : m.productId}</td>
            <td className="border p-2">{m.type}</td>
            <td className="border p-2">{m.quantity}</td>
            <td className="border p-2">{m.previousStock}</td>
            <td className="border p-2">{m.newStock}</td>
            <td className="border p-2">{m.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
