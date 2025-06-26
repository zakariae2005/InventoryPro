// store/useKPI.ts
import { create } from 'zustand'

export interface KPIData {
  totalRevenue: number
  totalExpenses: number
  totalDebts: number
  lowStockAlerts: number
  month: string
}

type KPIState = {
  kpiData: KPIData | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setKPIData: (data: KPIData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // API calls
  fetchKPIData: () => Promise<void>
}

export const useKPI = create<KPIState>((set, get) => ({
  kpiData: null,
  isLoading: false,
  error: null,

  setKPIData: (kpiData) => set({ kpiData }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchKPIData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/kpi')
      if (!response.ok) {
        throw new Error('Failed to fetch KPI data')
      }
      const data = await response.json()
      set({ kpiData: data, isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
    }
  },
}))