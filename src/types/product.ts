// types/product.ts
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  sellPrice: number
  quantity: number
  availableQuantity: number
  category: string
  image: string | null
  storeId: string
  createdAt: string
  updatedAt: string
}

export type ProductPayload = {
  name: string
  description?: string
  price: number
  sellPrice: number
  quantity: number
  availableQuantity?: number
  category?: string
  image?: string
}

export type ProductFormData = {
  name: string
  description: string
  price: string
  sellPrice: string
  quantity: string
  availableQuantity: string
  category: string
  image: string
}