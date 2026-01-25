
export interface InventoryOverviewDTO {
  _id: string
  nombre: string
  productos: {
    _id: string
    nombre: string
    codigoPrincipal: string
    variaciones: {
      _id: string
      nombre: string
      medida: string
      stock: number
      stockMinimo: number
      precio: number
      alerta: boolean
    }[]
  }[]
}