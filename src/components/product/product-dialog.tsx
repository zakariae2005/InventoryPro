"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product, ProductFormData } from "@/types/product"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSubmit: (product: ProductFormData) => Promise<void>
  isLoading?: boolean
}

const categories = [
  "Electronics", 
  "Home & Kitchen", 
  "Sports", 
  "Books", 
  "Clothing", 
  "Health & Beauty", 
  "Toys & Games",
  "Food & Beverages",
  "Automotive",
  "Office Supplies"
]

export function ProductDialog({ open, onOpenChange, product, onSubmit, isLoading = false }: ProductDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    sellPrice: "",
    quantity: "",
    availableQuantity: "",
    category: "",
    image: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        sellPrice: product.sellPrice.toString(),
        quantity: product.quantity.toString(),
        availableQuantity: product.availableQuantity.toString(),
        category: product.category,
        image: product.image || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        sellPrice: "",
        quantity: "",
        availableQuantity: "",
        category: "",
        image: "",
      })
    }
    setErrors({})
  }, [product, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number"
    }

    if (!formData.sellPrice.trim()) {
      newErrors.sellPrice = "Sell price is required"
    } else if (isNaN(Number(formData.sellPrice)) || Number(formData.sellPrice) <= 0) {
      newErrors.sellPrice = "Sell price must be a valid positive number"
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = "Quantity is required"
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = "Quantity must be a valid non-negative number"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    // Set available quantity to quantity if not provided
    if (!formData.availableQuantity.trim()) {
      setFormData(prev => ({ ...prev, availableQuantity: formData.quantity }))
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Make changes to the product details below."
              : "Fill in the product details below to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter product description"
                rows={3}
                disabled={isLoading}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Cost Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sellPrice">Sell Price *</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellPrice}
                  onChange={(e) => handleInputChange("sellPrice", e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {errors.sellPrice && <p className="text-sm text-red-600">{errors.sellPrice}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Total Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  placeholder="0"
                  disabled={isLoading}
                />
                {errors.quantity && <p className="text-sm text-red-600">{errors.quantity}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="availableQuantity">Available Quantity</Label>
                <Input
                  id="availableQuantity"
                  type="number"
                  min="0"
                  value={formData.availableQuantity}
                  onChange={(e) => handleInputChange("availableQuantity", e.target.value)}
                  placeholder="Same as total quantity"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (product ? "Updating..." : "Adding...") : (product ? "Update Product" : "Add Product")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}