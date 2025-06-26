import React, { useState, useEffect } from 'react'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DebtFormData, Debt } from "@/types/debt"

interface DebtDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debt?: Debt | null
  onSubmit: (formData: DebtFormData) => Promise<void>
  isLoading: boolean
}

const DebtDialog: React.FC<DebtDialogProps> = ({
  open,
  onOpenChange,
  debt,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<DebtFormData>({
    name: "",
    type: "CUSTOMER",
    amount: "",
    status: "PENDING",
    paidAt: new Date(),
    notes: "",
  })

  // Reset form when dialog opens/closes or when debt changes
  useEffect(() => {
    if (open) {
      if (debt) {
        // Editing existing debt
        setFormData({
          name: debt.name || "",
          type: debt.type || "CUSTOMER",
          amount: debt.amount?.toString() || "",
          status: debt.status || "PENDING",
          paidAt: debt.paidAt ? new Date(debt.paidAt) : new Date(),
          notes: debt.notes || "",
        })
      } else {
        // Adding new debt
        setFormData({
          name: "",
          type: "CUSTOMER",
          amount: "",
          status: "PENDING",
          paidAt: new Date(),
          notes: "",
        })
      }
    }
  }, [open, debt])

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting debt:', error)
    }
  }

  const isFormValid = formData.name.trim() && formData.amount && parseFloat(formData.amount) > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{debt ? "Edit Debt" : "Add New Debt"}</DialogTitle>
          <DialogDescription>
            {debt ? "Update the debt information below." : "Enter the details for the new debt."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Debtor Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter debtor name"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "CUSTOMER" | "SUPPLIER") => setFormData({ ...formData, type: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="SUPPLIER">Supplier</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "PENDING" | "PAID" | "OVERDUE") => setFormData({ ...formData, status: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.status === "PAID" && (
            <div className="grid gap-2">
              <Label>Paid Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.paidAt && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.paidAt ? format(formData.paidAt, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.paidAt}
                    onSelect={(date) => setFormData({ ...formData, paidAt: date || new Date() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes..."
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Saving..." : debt ? "Update Debt" : "Add Debt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DebtDialog