import { create } from 'zustand'
import { StorePayload } from '@/types'

type StoreState = {
  stores: StorePayload[]
  setStores: (stores: StorePayload[]) => void
}

export const useStore = create<StoreState>((set) => ({
  stores: [],
  setStores: (stores) => set({ stores }),
}))
