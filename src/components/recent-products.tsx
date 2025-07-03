"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Package } from "lucide-react"
import { useProduct } from "@/store/useProduct"
import { useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

export function RecentProducts() {
  const { 
    products, 
    error, 
    fetchProducts, 
  } = useProduct()

   useEffect(() => {
      fetchProducts()
    }, [fetchProducts])

    useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <Card className="border-slate-200/50 bg-white/60 backdrop-blur-sm shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-slate-600" />
          <CardTitle className="text-lg font-bold text-slate-900">Recent Products</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Link href="/products">
          View All
          </Link>
          
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.slice(-5).map((product) => (
            <div 
              key={product.id} 
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white hover:shadow-md hover:border-slate-300/50 transition-all duration-200"
            >
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 text-sm">{product.name}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {product.category}
                  </Badge>
                  <span className="text-sm font-bold text-emerald-600">${product.price}</span>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    product.availableQuantity < 5 ? "text-red-600" : "text-slate-700"
                  }`}
                >
                  {product.availableQuantity} in stock
                </p>
                {product.availableQuantity < 5 && (
                  <Badge variant="destructive" className="text-xs mt-1 bg-red-50 text-red-700 border-red-200">
                    Low Stock
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}