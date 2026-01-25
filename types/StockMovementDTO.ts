export interface StockMovementDTO {
  _id: string
  tipo: 'ingreso' | 'egreso' | 'ajuste'
  cantidad: number
  motivo: string
  createdAt: string
  order?: {
    _id: string
    codigo: string
  }
  product?: {
    _id: string
    nombre: string
  }
  variation?: {
    _id: string
    nombre: string
    medida: string
  }
}