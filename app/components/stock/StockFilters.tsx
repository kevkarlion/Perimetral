'use client'
import { useState } from 'react'

interface Props {
  onFilter: (filters: any) => void
}

export default function StockFilters({ onFilter }: Props) {
  const [variationId, setVariationId] = useState('')
  const [type, setType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({ variationId, type, startDate, endDate })
  }

  const handleClear = () => {
    setVariationId('')
    setType('')
    setStartDate('')
    setEndDate('')
    onFilter({ variationId: '', type: '', startDate: '', endDate: '' })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">Filtros de Stock</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0">
        {/* Desktop layout - horizontal */}
        <div className="hidden md:flex md:flex-wrap md:gap-4 md:items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID de Variación</label>
            <input 
              value={variationId} 
              onChange={e => setVariationId(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ej: 615aab12c54d"
            />
          </div>
          
          <div className="w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Todos</option>
              <option value="in">Ingreso</option>
              <option value="out">Salida</option>
              <option value="adjustment">Ajuste</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
          
          <div className="w-[170px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
          
          <div className="w-[170px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="h-[42px] bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Filtrar
            </button>
            <button 
              type="button" 
              onClick={handleClear}
              className="h-[42px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Limpiar
            </button>
          </div>
        </div>
        
        {/* Mobile layout - vertical */}
        <div className="space-y-4 md:hidden">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID de Variación</label>
            <input 
              value={variationId} 
              onChange={e => setVariationId(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ej: 615aab12c54d"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Todos</option>
              <option value="in">Ingreso</option>
              <option value="out">Salida</option>
              <option value="adjustment">Ajuste</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium"
            >
              Aplicar Filtros
            </button>
            <button 
              type="button" 
              onClick={handleClear}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium"
            >
              Limpiar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}