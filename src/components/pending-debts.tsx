"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Users, DollarSign } from "lucide-react"
import { useDebt } from "@/store/useDebt"
import { useEffect, useMemo } from "react"
import { toast } from "sonner"

export function PendingDebts() {
  const { debts, isLoading, error, fetchDebts } = useDebt()

  useEffect(() => {
    fetchDebts()
  }, [fetchDebts])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Calculate unpaid debts (both PENDING and OVERDUE)
  const debtStats = useMemo(() => {
    console.log('All debts:', debts) // Debug log
    
    // Get all unpaid debts (not PAID)
    const unpaidDebts = debts.filter(debt => debt.status !== "PAID")
    const overdueDebts = debts.filter(debt => debt.status === "OVERDUE")
    
    const totalUnpaidAmount = unpaidDebts.reduce((sum, debt) => sum + debt.amount, 0)
    
    console.log('Unpaid debts:', unpaidDebts) // Debug log
    console.log('Overdue debts:', overdueDebts) // Debug log
    console.log('Total unpaid amount:', totalUnpaidAmount) // Debug log
    
    return {
      unpaidDebts: overdueDebts.length, // Still show overdue count in the main stat
      totalUnpaidAmount, // But show total of all unpaid debts
      totalUnpaidCount: unpaidDebts.length
    }
  }, [debts])

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
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-amber-200 rounded mb-2"></div>
                <div className="h-4 bg-amber-200 rounded w-20 mx-auto"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-amber-800 mb-1">
                  {debtStats.unpaidDebts}
                </p>
                <p className="text-sm text-amber-600 font-medium">Overdue Debts</p>
              </>
            )}
          </div>
          
          <div className="text-center p-4 bg-white/80 rounded-xl border border-amber-200/50 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-100 w-fit mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-amber-200 rounded mb-2"></div>
                <div className="h-4 bg-amber-200 rounded w-20 mx-auto"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-amber-800 mb-1">
                  ${debtStats.totalUnpaidAmount.toLocaleString()}
                </p>
                <p className="text-sm text-amber-600 font-medium">Total Unpaid</p>
              </>
            )}
          </div>
        </div>
        
        {/* Show additional info when there are no overdue debts */}
        {!isLoading && debtStats.unpaidDebts === 0 && (
          <div className="text-center py-2">
            <p className="text-sm text-amber-600 font-medium">
              🎉 No overdue debts! Great job!
            </p>
          </div>
        )}
        
        {/* Show breakdown of all debt statuses */}
        {!isLoading && debts.length > 0 && (
          <div className="text-center py-2">
            <div className="flex justify-center space-x-4 text-xs text-amber-600">
              <span>
                Pending: {debts.filter(d => d.status === "PENDING").length}
              </span>
              <span>
                Paid: {debts.filter(d => d.status === "PAID").length}
              </span>
              <span>
                Overdue: {debts.filter(d => d.status === "OVERDUE").length}
              </span>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "View All Debts"}
        </Button>
      </CardContent>
    </Card>
  )
}