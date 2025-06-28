// store/useSale.ts
import { Sale, SalePayload } from '@/types/sale'
import { create } from 'zustand'

type SaleState = {
  sales: Sale[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setSales: (sales: Sale[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // API calls
  fetchSales: () => Promise<void>
  fetchSale: (id: string) => Promise<Sale | null>
  createSale: (sale: SalePayload) => Promise<void>
  updateSale: (id: string, sale: SalePayload) => Promise<void>
  deleteSale: (id: string) => Promise<void>
}

export const useSale = create<SaleState>((set) => ({
  sales: [],
  isLoading: false,
  error: null,

  setSales: (sales) => set({ sales }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchSales: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/sale')
      if (!response.ok) {
        throw new Error('Failed to fetch sales')
      }
      const sales = await response.json()
      set({ sales, isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
    }
  },

  fetchSale: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/sale/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sale')
      }
      const sale = await response.json()
      set({ isLoading: false })
      return sale
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      return null
    }
  },

  createSale: async (sale: SalePayload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create sale')
      }
      
      const newSale = await response.json()
      set(state => ({ 
        sales: [newSale, ...state.sales], 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },

  updateSale: async (id: string, sale: SalePayload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/sale/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update sale')
      }
      
      const updatedSale = await response.json()
      set(state => ({ 
        sales: state.sales.map(s => s.id === id ? updatedSale : s), 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },

  deleteSale: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/sale/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete sale')
      }
      
      set(state => ({ 
        sales: state.sales.filter(s => s.id !== id), 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },
}))

// Helper function to calculate sale total
export const calculateSaleTotal = (sale: Sale): number => {
  return sale.items.reduce((total, item) => total + (item.sellPrice * item.quantity), 0)
}

// Helper function to get sale summary
export const getSaleSummary = (sale: Sale) => {
  const total = calculateSaleTotal(sale)
  const itemCount = sale.items.reduce((count, item) => count + item.quantity, 0)
  
  return {
    total,
    itemCount,
    productCount: sale.items.length
  }
}