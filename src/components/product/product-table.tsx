"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Package, DollarSign } from "lucide-react"
import { Product } from "@/types/product"

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export function ProductTable({ products, onEdit, onDelete, isLoading = false }: ProductTableProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Electronics":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Home & Kitchen":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Sports":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "Books":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Clothing":
        return "bg-pink-50 text-pink-700 border-pink-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStockStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage === 0) {
      return {
        badge: "bg-red-50 text-red-700 border-red-200",
        text: "Out of Stock",
        textColor: "text-red-600"
      }
    }
    if (percentage < 20) {
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        text: "Low Stock",
        textColor: "text-amber-600"
      }
    }
    if (percentage < 50) {
      return {
        badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
        text: "Medium Stock",
        textColor: "text-yellow-600"
      }
    }
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      text: "In Stock",
      textColor: "text-emerald-600"
    }
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
        </div>
        <p className="text-slate-600 font-medium">Loading products...</p>
        <p className="text-slate-500 text-sm mt-1">Please wait while we fetch your inventory</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="border-slate-200 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700 py-4">Product Details</TableHead>
            <TableHead className="font-semibold text-slate-700">Category</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Cost Price</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Sell Price</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Stock Status</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-600 font-medium text-lg">No products found</p>
                    <p className="text-slate-500">Add your first product to start managing your inventory</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            products.map((product, index) => {
              const stockStatus = getStockStatus(product.availableQuantity, product.quantity)
              return (
                <TableRow 
                  key={product.id} 
                  className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border border-slate-200 shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                            <Package className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-semibold text-slate-900 truncate">{product.name}</span>
                        {product.description && (
                          <span className="text-sm text-slate-500 truncate mt-1 max-w-xs">
                            {product.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${getCategoryColor(product.category)} border font-medium`}
                    >
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1 font-mono">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-slate-700 font-medium">{product.price.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1 font-mono">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-slate-900 font-semibold">{product.sellPrice.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Badge 
                        variant="outline" 
                        className={`${stockStatus.badge} border font-medium px-3 py-1`}
                      >
                        {product.availableQuantity}/{product.quantity}
                      </Badge>
                      <span className={`text-xs font-medium ${stockStatus.textColor}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onEdit(product)}
                        className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150"
                      >
                        <Edit className="h-3.5 w-3.5 text-slate-600" />
                        <span className="sr-only">Edit {product.name}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="h-8 w-8 p-0 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-150"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete {product.name}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}