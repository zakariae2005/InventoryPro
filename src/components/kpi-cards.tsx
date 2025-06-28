'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, CreditCard, AlertTriangle, Loader2 } from "lucide-react"
import { useKPI } from "@/store/useKPI"
import { useEffect } from "react"

export function KPICards() {
  const { kpiData, isLoading, error, fetchKPIData } = useKPI()

  useEffect(() => {
    fetchKPIData()
  }, [fetchKPIData])

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200/50 bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-slate-200 rounded-xl animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-1 w-12 bg-slate-200 rounded-full animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error loading KPI data: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default values if no data
  const defaultKPIData = {
    totalRevenue: 0,
    totalExpenses: 0,
    totalDebts: 0,
    lowStockAlerts: 0,
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  const currentKPIData = kpiData || defaultKPIData

  const cards = [
    {
      title: "Total Revenue",
      subtitle: `This month (${currentKPIData.month})`,
      value: `$${currentKPIData.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
      borderColor: "border-emerald-200/50",
    },
    {
      title: "Total Expenses",
      subtitle: "Current stock value",
      value: `$${currentKPIData.totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-rose-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-rose-100/50",
      borderColor: "border-rose-200/50",
    },
    {
      title: "Total Debts",
      subtitle: "Outstanding amounts",
      value: `$${currentKPIData.totalDebts.toLocaleString()}`,
      icon: CreditCard,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100/50",
      borderColor: "border-amber-200/50",
    },
    {
      title: "Low Stock Alerts",
      subtitle: "Products ≤ 10 units",
      value: currentKPIData.lowStockAlerts.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
      borderColor: "border-red-200/50",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Key Performance Indicators
        </h2>
        <button
          onClick={fetchKPIData}
          className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          disabled={isLoading}
        >
          <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card 
            key={index} 
            className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border ${card.borderColor} bg-white/60 backdrop-blur-sm`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-700">{card.title}</CardTitle>
                {/* <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p> */}
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor} border border-white/50 shadow-sm`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
              <div className="flex items-center space-x-1">
                <div className="h-1 w-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}