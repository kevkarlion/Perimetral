
export interface OrderDTO {
  _id: string
  codigo: string
  estado: 'pendiente' | 'pagado' | 'cancelado'
  total: number
  createdAt: string
  items: {
    producto: string
    variacion: string
    cantidad: number
    precio: number
  }[]
}