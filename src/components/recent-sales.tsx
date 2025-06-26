import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ShoppingCart } from "lucide-react"

const recentSales = [
  {
    id: 1,
    clientName: "John Smith",
    quantity: 2,
    totalPrice: 199.98,
    date: "2024-01-15",
  },
  {
    id: 2,
    clientName: "Sarah Johnson",
    quantity: 1,
    totalPrice: 12.5,
    date: "2024-01-15",
  },
  {
    id: 3,
    clientName: "Mike Davis",
    quantity: 3,
    totalPrice: 135.0,
    date: "2024-01-14",
  },
  {
    id: 4,
    clientName: "Emily Brown",
    quantity: 1,
    totalPrice: 18.75,
    date: "2024-01-14",
  },
  {
    id: 5,
    clientName: "David Wilson",
    quantity: 2,
    totalPrice: 130.0,
    date: "2024-01-13",
  },
]

export function RecentSales() {
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
          {recentSales.map((sale) => (
            <div 
              key={sale.id} 
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white hover:shadow-md hover:border-slate-300/50 transition-all duration-200"
            >
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 text-sm">{sale.clientName}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
                    Qty: {sale.quantity}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(sale.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">${sale.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}