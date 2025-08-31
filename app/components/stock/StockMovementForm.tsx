// 'use client'
// import { useState } from 'react'

// export default function StockMovementForm({ onCreate }: { onCreate: (data: any) => void }) {
//   const [form, setForm] = useState({ productId: '', type: 'in', quantity: 0, reason: '' })

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onCreate(form)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap border p-4 rounded">
//       <input placeholder="ID Producto" value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} className="border p-2" />
//       <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border p-2">
//         <option value="in">Ingreso</option>
//         <option value="out">Salida</option>
//         <option value="adjustment">Ajuste</option>
//         <option value="transfer">Transferencia</option>
//       </select>
//       <input type="number" placeholder="Cantidad" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} className="border p-2" />
//       <input placeholder="Razón" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="border p-2" />
//       <button className="bg-green-600 text-white px-4 py-2 rounded">Crear</button>
//     </form>
//   )
// }
