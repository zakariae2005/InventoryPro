/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductTable } from "@/components/product/product-table"
import { ProductDialog } from "@/components/product/product-dialog"
import { useProduct } from "@/store/useProduct"
import { Product, ProductFormData } from "@/types/product"
import { toast } from "sonner"
import { Plus, RefreshCw, Package, TrendingUp, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function ProductsPage() {
  const { 
    products, 
    isLoading, 
    error, 
    fetchProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useProduct()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Calculate stats
  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
  const lowStockCount = products.filter(product => 
    product.availableQuantity < product.quantity * 0.2 && product.availableQuantity > 0
  ).length
  const outOfStockCount = products.filter(product => product.availableQuantity === 0).length

  const handleAddProduct = async (formData: ProductFormData) => {
    try {
      await createProduct({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        sellPrice: parseFloat(formData.sellPrice),
        quantity: parseInt(formData.quantity),
        availableQuantity: formData.availableQuantity 
          ? parseInt(formData.availableQuantity) 
          : parseInt(formData.quantity),
        category: formData.category,
        image: formData.image.trim() || undefined,
      })
      toast.success("Product added successfully!")
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Failed to add product")
    }
  }

  const handleEditProduct = async (formData: ProductFormData) => {
    if (!editingProduct) return

    try {
      await updateProduct(editingProduct.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        sellPrice: parseFloat(formData.sellPrice),
        quantity: parseInt(formData.quantity),
        availableQuantity: formData.availableQuantity 
          ? parseInt(formData.availableQuantity) 
          : parseInt(formData.quantity),
        category: formData.category,
        image: formData.image.trim() || undefined,
      })
      toast.success("Product updated successfully!")
      setEditingProduct(null)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Failed to update product")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        toast.success("Product deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete product")
      }
    }
  }

  const handleRefresh = () => {
    fetchProducts()
  }

  const openAddDialog = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 w-full">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Overview"
          description="Dashboard overview of your stock management"
          breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Overview" }]}
        />
        
        {/* Header Section */}
        <div className="mb-8 mt-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-slate-600 text-lg">Manage your product inventory with ease</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button 
                variant="outline" 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="flex-1 lg:flex-none h-11 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={openAddDialog} 
                className="flex-1 lg:flex-none h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {totalProducts > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Products</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{totalProducts}</p>
                </div>
                <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Inventory Value</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">${totalValue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Low Stock</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{outOfStockCount}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="font-medium text-red-800">Error loading products</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <ProductTable 
            products={products} 
            onEdit={openEditDialog} 
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
          />
        </div>

        {/* Product Dialog */}
        <ProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={editingProduct}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}