import { Debt, DebtPayload } from '@/types/debt'
import { create } from 'zustand'

type DebtState = {
  debts: Debt[]  // Fixed: was Debt instead of Debt[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setDebts: (debts: Debt[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // API calls
  fetchDebts: () => Promise<void>
  createDebt: (debt: DebtPayload) => Promise<void>
  updateDebt: (id: string, debt: DebtPayload) => Promise<void>
  deleteDebt: (id: string) => Promise<void>
}

export const useDebt = create<DebtState>((set) => ({
  debts: [],
  isLoading: false,
  error: null,

  setDebts: (debts) => set({ debts }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchDebts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/debt')
      if (!response.ok) {
        throw new Error('Failed to fetch debts')
      }
      const debts = await response.json()
      set({ debts, isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
    }
  },

  createDebt: async (debt: DebtPayload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/debt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(debt),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create debt')
      }
      
      const newDebt = await response.json()
      set(state => ({ 
        debts: [...state.debts, newDebt], 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },

  updateDebt: async (id: string, debt: DebtPayload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/debt/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(debt),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update debt')
      }
      
      const updatedDebt = await response.json()
      set(state => ({ 
        debts: state.debts.map(d => d.id === id ? updatedDebt : d), 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },

  deleteDebt: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/debt/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete debt')
      }
      
      set(state => ({ 
        debts: state.debts.filter(d => d.id !== id), 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
      throw error
    }
  },
}))