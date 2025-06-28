"use client"

import { useState, useMemo, useEffect } from "react"
import { format } from "date-fns"
import { Plus, Search, Edit, Trash2, Check, ArrowUpDown } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useDebt } from "@/store/useDebt"
import { toast } from "sonner"
import { DebtFormData, Debt } from "@/types/debt"
import DebtDialog from "@/components/debt/DebtDialog"

type DebtStatus = "PENDING" | "PAID" | "OVERDUE"
type DebtType = "CUSTOMER" | "SUPPLIER"

export default function DebtsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"All" | DebtType>("All")
  const [sortField, setSortField] = useState<"createdAt" | "amount" | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  const { 
    debts, 
    isLoading, 
    error, 
    fetchDebts, 
    createDebt, 
    updateDebt, 
    deleteDebt 
  } = useDebt()

  useEffect(() => {
    fetchDebts()
  }, [fetchDebts])

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleAddDebt = async (formData: DebtFormData) => {
    try {
      const debtData = {
        name: formData.name.trim(),
        type: formData.type,
        notes: formData.notes?.trim() || undefined,
        status: formData.status,
        amount: parseFloat(formData.amount),
        paidAt: formData.status === "PAID" ? new Date(formData.paidAt) : undefined
      }
      
      await createDebt(debtData)
      toast.success("Debt added successfully!")
      setIsDialogOpen(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to add debt")
    }
  }

  const handleEditDebt = async (formData: DebtFormData) => {
    if (!editingDebt) return

    try {
      const debtData = {
        name: formData.name.trim(),
        type: formData.type,
        notes: formData.notes?.trim() || undefined,
        status: formData.status,
        amount: parseFloat(formData.amount),
        paidAt: formData.status === "PAID" ? new Date(formData.paidAt) : undefined
      }
      
      await updateDebt(editingDebt.id, debtData)
      toast.success("Debt updated successfully!")
      setEditingDebt(null)
      setIsDialogOpen(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update debt")
    }
  }

  const handleDeleteDebt = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this debt?")) {
      try {
        await deleteDebt(id)
        toast.success("Debt deleted successfully!")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to delete debt")
      }
    }
  }

  const handleMarkAsPaid = async (debt: Debt) => {
    try {
      await updateDebt(debt.id, {
        ...debt,
        status: "PAID",
        paidAt: new Date()
      })
      toast.success("Debt marked as paid!")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to mark debt as paid")
    }
  }

  const openAddDialog = () => {
    setEditingDebt(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (debt: Debt) => {
    setEditingDebt(debt)
    setIsDialogOpen(true)
  }

  // Check if debt is overdue
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isOverdue = (debt: Debt) => {
    return debt.status !== "PAID" && debt.createdAt && new Date(debt.createdAt) < new Date()
  }

  // Update debt status automatically based on due date
  const updateDebtStatuses = (debtsList: Debt[]) => {
    return debtsList.map((debt) => ({
      ...debt,
      status: debt.status === "PAID" 
        ? "PAID" as DebtStatus
        : debt.createdAt && new Date(debt.createdAt) < new Date()
          ? "OVERDUE" as DebtStatus
          : "PENDING" as DebtStatus,
    }))
  }

  // Filter and sort debts
  const filteredAndSortedDebts = useMemo(() => {
    const filtered = updateDebtStatuses(debts).filter((debt) => {
      const matchesSearch =
        debt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.status.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "All" || debt.type === typeFilter
      return matchesSearch && matchesType
    })

    if (sortField) {
  filtered.sort((a, b) => {
    let aValue: number
    let bValue: number

    if (sortField === "createdAt") {
      aValue = new Date(a.createdAt ?? "").getTime()
      bValue = new Date(b.createdAt ?? "").getTime()
    } else {
      aValue = a.amount
      bValue = b.amount
    }

    return sortDirection === "asc"
      ? aValue - bValue
      : bValue - aValue
  })
}


    return filtered
  }, [debts, searchTerm, typeFilter, sortField, sortDirection])

  const handleSort = (field: "createdAt" | "amount") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadgeVariant = (status: DebtStatus) => {
    switch (status) {
      case "PAID":
        return "default"
      case "PENDING":
        return "secondary"
      case "OVERDUE":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const totalDebt = filteredAndSortedDebts.reduce((sum, debt) => 
    debt.status !== "PAID" ? sum + debt.amount : sum, 0
  )

  const overdueCount = filteredAndSortedDebts.filter((debt) => 
    debt.status === "OVERDUE"
  ).length

  if (isLoading && debts.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading debts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <PageHeader
        title="Debts"
        description="Manage outstanding debts and receivables"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Debts" }]}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Debts Management</h1>
          <p className="text-muted-foreground">Track and manage outstanding debts from customers and suppliers</p>
        </div>
        <Button onClick={openAddDialog} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Debt
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDebt.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Debts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAndSortedDebts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value: "All" | DebtType) => setTypeFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="CUSTOMER">Customers</SelectItem>
            <SelectItem value="SUPPLIER">Suppliers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Debts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Debtor Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("amount")}
                      className="h-auto p-0 font-medium"
                    >
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("createdAt")}
                      className="h-auto p-0 font-medium"
                    >
                      Created Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDebts.map((debt) => (
                  <TableRow key={debt.id} className={cn(debt.status === "OVERDUE" && "bg-red-50 dark:bg-red-950/20")}>
                    <TableCell className="font-medium">{debt.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{debt.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">${debt.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={cn(debt.status === "OVERDUE" && "text-red-600 font-medium")}>
                        {debt.createdAt ? format(new Date(debt.createdAt), "MMM dd, yyyy") : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(debt.status as DebtStatus)}>{debt.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">{debt.notes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {debt.status !== "PAID" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(debt)}
                            className="h-8 w-8 p-0"
                            disabled={isLoading}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(debt)}
                          className="h-8 w-8 p-0"
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDebt(debt.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredAndSortedDebts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {debts.length === 0 ? "No debts found. Add your first debt!" : "No debts found matching your criteria."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Debt Dialog */}
      <DebtDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        debt={editingDebt}
        onSubmit={editingDebt ? handleEditDebt : handleAddDebt}
        isLoading={isLoading}
      />
    </div>
  )
}