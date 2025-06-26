// store/useProduct.ts
import { Product, ProductPayload } from '@/types/product'
import { create } from 'zustand'

type ProductState = {
  products: Product[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setProducts: (products: Product[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // API calls
  fetchProducts: () => Promise<void>
  createProduct: (product: ProductPayload) => Promise<void>
  updateProduct: (id: string, product: ProductPayload) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

export const useProduct = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/product')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const products = await response.json()
      set({ products, isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
    }
  },

  createProduct: async (product: ProductPayload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create product')
      }
      
      const newProduct = await response.json()
      set(state => ({ 
        products: [...state.products, newProduct], 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },

  updateProduct: async (id: string, product: ProductPayload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update product')
      }
      
      const updatedProduct = await response.json()
      set(state => ({ 
        products: state.products.map(p => p.id === id ? updatedProduct : p), 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete product')
      }
      
      set(state => ({ 
        products: state.products.filter(p => p.id !== id), 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },
}))