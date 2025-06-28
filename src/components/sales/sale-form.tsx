"use client"

import React, { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Sale, SalePayload } from "@/types/sale"

interface Product {
  id: string
  name: string
  price: number
  sellPrice: number
  availableQuantity: number
  category: string
}

interface SaleFormProps {
  products: Product[]
  editingSale: Sale | null
  onSubmit: (formData: SalePayload) => void
  onCancel: () => void
  isLoading?: boolean
}

interface SaleItemForm {
  productId: string
  quantity: number
  sellPrice: number
}

export default function SaleForm({ products, editingSale, onSubmit, onCancel, isLoading }: SaleFormProps) {
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [items, setItems] = useState<SaleItemForm[]>([{ productId: "", quantity: 1, sellPrice: 0 }])
  const [openProductIndex, setOpenProductIndex] = useState<number | null>(null)

  // Initialize form data
  useEffect(() => {
    if (editingSale) {
      setClientName(editingSale.clientName || "")
      setClientPhone(editingSale.clientPhone || "")
      setItems(editingSale.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        sellPrice: item.sellPrice
      })))
    } else {
      // Reset form for new sale
      setClientName("")
      setClientPhone("")
      setItems([{ productId: "", quantity: 1, sellPrice: 0 }])
    }
  }, [editingSale])

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, sellPrice: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof SaleItemForm, value: string | number) => {
    const updatedItems = [...items]
    
    if (field === 'productId') {
      // productId should always be a string
      updatedItems[index] = { ...updatedItems[index], [field]: String(value) }
    } else if (field === 'quantity') {
      // quantity should be a number, with minimum value of 1
      updatedItems[index] = { ...updatedItems[index], [field]: Math.max(1, Number(value)) }
    } else if (field === 'sellPrice') {
      // sellPrice should be a number, with minimum value of 0
      updatedItems[index] = { ...updatedItems[index], [field]: Math.max(0, Number(value)) }
    }
    
    setItems(updatedItems)
  }

  const selectProduct = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      // Use functional update to ensure we get the latest state
      setItems(prevItems => {
        const newItems = [...prevItems]
        newItems[index] = {
          ...newItems[index],
          productId: productId,
          sellPrice: product.sellPrice
        }
        return newItems
      })
    }
    setOpenProductIndex(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Form submission - current items:', items) // Debug log

    // Validation
    if (items.length === 0) {
      alert("Please add at least one item")
      return
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      // Check if product is selected - Fixed validation
      if (!item.productId || item.productId === "") {
        alert(`Please select a product for item ${i + 1}`)
        return
      }

      // Check quantity (must be at least 1)
      if (!item.quantity || item.quantity < 1) {
        alert(`Please enter a valid quantity for item ${i + 1}`)
        return
      }

      // Check sell price (must be greater than 0)
      if (!item.sellPrice || item.sellPrice <= 0) {
        alert(`Please enter a valid sell price for item ${i + 1}`)
        return
      }

      // Check available quantity
      const product = products.find(p => p.id === item.productId)
      if (product && item.quantity > product.availableQuantity) {
        alert(`Insufficient quantity for ${product.name}. Available: ${product.availableQuantity}, Requested: ${item.quantity}`)
        return
      }
    }

    const formData: SalePayload = {
      clientName: clientName.trim() || undefined,
      clientPhone: clientPhone.trim() || undefined,
      items: items.map(item => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        sellPrice: Number(item.sellPrice)
      }))
    }

    console.log('Submitting form data:', formData) // Debug log
    onSubmit(formData)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0
      const sellPrice = Number(item.sellPrice) || 0
      return total + (quantity * sellPrice)
    }, 0)
  }

  const getAvailableProducts = (currentIndex: number) => {
    const selectedProductIds = items
      .map((item, index) => index !== currentIndex ? item.productId : null)
      .filter(Boolean)
    
    return products.filter(product => 
      !selectedProductIds.includes(product.id) && product.availableQuantity > 0
    )
  }

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editingSale ? "Edit Sale" : "Add New Sale"}</DialogTitle>
        <DialogDescription>
          {editingSale ? "Update the sale information below." : "Enter the details for the new sale."}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name (optional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Client Phone</Label>
            <Input
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Enter phone number (optional)"
            />
          </div>
        </div>

        {/* Sale Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Sale Items</Label>
            <Button type="button" onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => {
            const selectedProduct = products.find(p => p.id === item.productId)
            const availableProducts = getAvailableProducts(index)

            return (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Item {index + 1}</span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Product Selection */}
                  <div className="space-y-2">
                    <Label>Product *</Label>
                    <Popover 
                      open={openProductIndex === index} 
                      onOpenChange={(open) => setOpenProductIndex(open ? index : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          role="combobox" 
                          className="w-full justify-between"
                          type="button"
                        >
                          {selectedProduct ? selectedProduct.name : "Select product..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search products..." />
                          <CommandList>
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup>
                              {availableProducts.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={product.name}
                                  onSelect={() => selectProduct(index, product.id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item.productId === product.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex justify-between w-full">
                                    <span>{product.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                      Stock: {product.availableQuantity}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {/* Debug info - remove this in production */}
                    <div className="text-xs text-gray-500">
                      Selected ID: {item.productId || 'none'}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="1"
                      max={selectedProduct?.availableQuantity || 999}
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      placeholder="Enter quantity"
                    />
                    {selectedProduct && (
                      <p className="text-xs text-muted-foreground">
                        Available: {selectedProduct.availableQuantity}
                      </p>
                    )}
                  </div>

                  {/* Sell Price */}
                  <div className="space-y-2">
                    <Label>Sell Price *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={item.sellPrice || ''}
                      onChange={(e) => updateItem(index, 'sellPrice', e.target.value)}
                      placeholder="Enter price"
                    />
                    {selectedProduct && (
                      <p className="text-xs text-muted-foreground">
                        Suggested: ${selectedProduct.sellPrice}
                      </p>
                    )}
                  </div>
                </div>

                {/* Item Subtotal */}
                <div className="text-right">
                  <span className="text-sm font-medium">
                    Subtotal: ${((Number(item.quantity) || 0) * (Number(item.sellPrice) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="text-right">
            <span className="text-lg font-bold">
              Total: ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : editingSale ? "Update Sale" : "Create Sale"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}