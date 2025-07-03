"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ShoppingCart } from "lucide-react"
import { useSale } from "@/store/useSale"
import { useEffect } from "react"
import { Sale } from "@/types/sale"

export function RecentSales() {
  const { fetchSales, sales, error, isLoading } = useSale()
  
  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  // Helper function to calculate total price
  const calculateTotalPrice = (sale: Sale): number => {
    return sale.items.reduce((total, item) => {
      return total + (item.sellPrice * item.quantity)
    }, 0)
  }

  // Helper function to calculate total quantity
  const calculateTotalQuantity = (sale: Sale): number => {
    return sale.items.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  }

  return (
    <Card className="border-slate-200/50 bg-white/60 backdrop-blur-sm shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5 text-slate-600" />
          <CardTitle className="text-lg font-bold text-slate-900">Recent Sales</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          View All
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 h-20 rounded-xl" />
            ))
          ) : (
            sales.slice(-5).reverse().map((sale) => (
              <div 
                key={sale.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white hover:shadow-md hover:border-slate-300/50 transition-all duration-200"
              >
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900 text-sm">
                    {sale.clientName || "Walk-in Customer"}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
                      Qty: {calculateTotalQuantity(sale)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                      {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    ${calculateTotalPrice(sale).toFixed(2)}
                  </p>
                  {sale.clientPhone && (
                    <p className="text-xs text-slate-500 mt-1">
                      {sale.clientPhone}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {error && (
          <div className="text-center py-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {!isLoading && sales.length === 0 && (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No sales found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}