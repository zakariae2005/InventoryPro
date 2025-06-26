// store/useSalesChart.ts
import { create } from 'zustand'

export interface SalesChartData {
  date: string
  fullDate: string
  revenue: number
  expenses: number
  salesCount: number
  monthIndex: number // Added for yearly data
}

type SalesChartState = {
  salesData: SalesChartData[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setSalesData: (data: SalesChartData[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // API calls
  fetchSalesChartData: () => Promise<void>
}

export const useSalesChart = create<SalesChartState>((set, get) => ({
  salesData: [],
  isLoading: false,
  error: null,

  setSalesData: (salesData) => set({ salesData }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchSalesChartData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/sales-chart')
      if (!response.ok) {
        throw new Error('Failed to fetch sales chart data')
      }
      const data = await response.json()
      set({ salesData: data, isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false })
    }
  },
}))