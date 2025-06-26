import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Users, DollarSign } from "lucide-react"

const debtsData = {
  unpaidDebts: 8,
  totalUnpaidAmount: 8750,
}

export function PendingDebts() {
  return (
    <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-amber-800">
          <div className="p-2 rounded-lg bg-amber-100 mr-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <span className="font-bold">Pending Debts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/80 rounded-xl border border-amber-200/50 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-100 w-fit mx-auto mb-3">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-800 mb-1">{debtsData.unpaidDebts}</p>
            <p className="text-sm text-amber-600 font-medium">Unpaid Debts</p>
          </div>
          <div className="text-center p-4 bg-white/80 rounded-xl border border-amber-200/50 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-100 w-fit mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-800 mb-1">
              ${debtsData.totalUnpaidAmount.toLocaleString()}
            </p>
            <p className="text-sm text-amber-600 font-medium">Total Amount</p>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          View All Debts
        </Button>
      </CardContent>
    </Card>
  )
}