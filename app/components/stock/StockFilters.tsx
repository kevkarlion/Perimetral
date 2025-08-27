'use client'
import { useState } from 'react'

interface Props {
  onFilter: (filters: any) => void
}

export default function StockFilters({ onFilter }: Props) {
  const [productId, setProductId] = useState('')
  const [type, setType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({ productId, type, startDate, endDate })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
      <div>
        <label>Producto</label>
        <input value={productId} onChange={e => setProductId(e.target.value)} className="border p-1" />
      </div>
      <div>
        <label>Tipo</label>
        <select value={type} onChange={e => setType(e.target.value)} className="border p-1">
          <option value="">Todos</option>
          <option value="in">Ingreso</option>
          <option value="out">Salida</option>
          <option value="adjustment">Ajuste</option>
          <option value="transfer">Transferencia</option>
        </select>
      </div>
      <div>
        <label>Desde</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-1" />
      </div>
      <div>
        <label>Hasta</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-1" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filtrar</button>
    </form>
  )
}
