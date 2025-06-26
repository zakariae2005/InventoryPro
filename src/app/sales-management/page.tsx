"use client"

import { useState, useEffect } from "react"
import { Edit, Plus, Search, Trash2, DollarSign, ShoppingCart, Users, TrendingUp, Calendar, Package } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import SaleForm from "@/components/sales/sale-form"
import { useSale } from "@/store/useSale"
import type { Sale } from "@/types/sale"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"

interface Product {
  id: string
  name: string
  price: number
  sellPrice: number
  availableQuantity: number
  category: string
}

export default function SalesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  
  const { toast } = useToast()
  const { 
    sales, 
    isLoading, 
    error, 
    fetchSales, 
    createSale, 
    updateSale, 
    deleteSale 
  } = useSale()

  // Fetch products from the correct endpoint
  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const response = await fetch('/api/product')
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Product fetch error:', errorText)
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
      const productsData = await response.json()
      console.log('Fetched products:', productsData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchSales()
    fetchProducts()
  }, [])

  // Calculate stats
  const totalSales = sales.length
  const totalRevenue = sales.reduce((sum, sale) => sum + calculateSaleTotal(sale), 0)
  const totalItemsSold = sales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  )
  const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0

  const handleSubmit = async (formData: any) => {
    try {
      console.log('Handling form submission:', formData)
      
      if (editingSale) {
        await updateSale(editingSale.id, formData)
        toast({
          title: "Success",
          description: "Sale updated successfully",
        })
      } else {
        await createSale(formData)
        toast({
          title: "Success",
          description: "Sale created successfully",
        })
      }
      handleDialogClose()
    } catch (error) {
      console.error('Error saving sale:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save sale",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale)
    setIsDialogOpen(true)
  }

  const handleDelete = async (saleId: string) => {
    if (!confirm('Are you sure you want to delete this sale?')) {
      return
    }

    try {
      await deleteSale(saleId)
      toast({
        title: "Success",
        description: "Sale deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting sale:', error)
      toast({
        title: "Error",
        description: "Failed to delete sale",
        variant: "destructive",
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingSale(null)
  }

  const handleNewSale = () => {
    if (products.length === 0) {
      toast({
        title: "No Products",
        description: "Please add products to your store before creating a sale.",
        variant: "destructive",
      })
      return
    }
    setEditingSale(null)
    setIsDialogOpen(true)
  }

  function calculateSaleTotal(sale: Sale): number {
    return sale.items.reduce((total, item) => total + (item.sellPrice * item.quantity), 0)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-red-800 font-medium">Error loading sales</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
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
                Sales Management
              </h1>
              <p className="text-slate-600 text-lg">Track your sales performance and manage transactions</p>
            </div>
            <Button 
              onClick={handleNewSale} 
              disabled={isLoadingProducts}
              className="h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full lg:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {totalSales > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Sales</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{totalSales}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Items Sold</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{totalItemsSold}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Sale Value</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">${avgSaleValue.toFixed(0)}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State for Products */}
        {isLoadingProducts && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 mx-auto mb-3"></div>
            <p className="text-slate-600 font-medium">Loading products...</p>
          </div>
        )}

        {/* Dialog for creating/editing sales */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <SaleForm
            products={products}
            editingSale={editingSale}
            onSubmit={handleSubmit}
            onCancel={handleDialogClose}
            isLoading={isLoading}
          />
        </Dialog>

        {/* Sales Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
              </div>
              <p className="text-slate-600 font-medium">Loading sales...</p>
              <p className="text-slate-500 text-sm mt-1">Please wait while we fetch your sales data</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No sales found</h3>
              <p className="text-slate-500 mb-6">Get started by recording your first sale transaction</p>
              <Button 
                onClick={handleNewSale} 
                disabled={isLoadingProducts || products.length === 0}
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Sale
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-slate-200">
                  <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                  <TableHead className="font-semibold text-slate-700 hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="font-semibold text-slate-700">Products</TableHead>
                  <TableHead className="font-semibold text-slate-700 hidden md:table-cell text-center">Items</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Total</TableHead>
                  <TableHead className="font-semibold text-slate-700 hidden lg:table-cell">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id} className="border-slate-200 hover:bg-slate-50/50 transition-colors duration-150">
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {sale.clientName || 'Unknown Customer'}
                          </p>
                          <p className="text-sm text-slate-500 sm:hidden">
                            {sale.clientPhone || 'No contact'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-slate-600 font-medium">
                        {sale.clientPhone || 'No phone'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {sale.items.slice(0, 2).map((item, index) => (
                          <div key={`${item.id}-${index}`} className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200">
                              {item.product?.name || 'Unknown Product'}
                            </Badge>
                            <span className="text-sm text-slate-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {sale.items.length > 2 && (
                          <div className="text-sm text-slate-500 font-medium">
                            +{sale.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                        {sale.items.reduce((count, item) => count + item.quantity, 0)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1 font-mono">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900 font-bold text-lg">
                          {calculateSaleTotal(sale).toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 font-medium">
                          {format(new Date(sale.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(sale)}
                          disabled={isLoading}
                          className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        >
                          <Edit className="h-3.5 w-3.5 text-slate-600" />
                          <span className="sr-only">Edit sale</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(sale.id)}
                          disabled={isLoading}
                          className="h-8 w-8 p-0 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete sale</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}