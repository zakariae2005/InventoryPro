// types/sale.ts

export interface Product {
  id: string
  name: string
  price: number
  sellPrice: number
  quantity: number
  availableQuantity: number
  category: string
  description?: string
  image?: string
  storeId: string
  createdAt: string
  updatedAt: string
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  quantity: number
  sellPrice: number
  product?: {
    id: string
    name: string
    price: number
    category: string
  }
}

export interface Sale {
  id: string
  clientName?: string
  clientPhone?: string
  storeId: string
  items: SaleItem[]
  createdAt: string
  updatedAt: string
}

export type CreateSaleItem = {
  productId: string
  quantity: number
  sellPrice: number
}

export type SalePayload = {
  clientName?: string
  clientPhone?: string
  items: CreateSaleItem[]
}

export type SaleFormData = {
  clientName?: string
  clientPhone?: string
  items: {
    productId: string
    quantity: number
    sellPrice: number
  }[]
}