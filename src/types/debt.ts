// types/debt.ts
export interface Debt {
  id: string
  name: string
  type: "CUSTOMER" | "SUPPLIER"
  amount: number
  status: "PENDING" | "PAID" | "OVERDUE"
  paidAt?: Date | string
  notes?: string
  storeId: string
  createdAt: string
  updatedAt: string
}

export type DebtPayload = {
  name: string
  type: "CUSTOMER" | "SUPPLIER"
  amount: number
  status: "PENDING" | "PAID" | "OVERDUE"
  paidAt?: Date
  notes?: string
}

export type DebtFormData = {
  name: string
  type: "CUSTOMER" | "SUPPLIER"
  amount: string  // Keep as string for form input
  status: "PENDING" | "PAID" | "OVERDUE"
  paidAt: Date
  notes: string
}