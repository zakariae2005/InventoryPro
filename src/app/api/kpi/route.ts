// api/kpi/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Find the user to get their store
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stores: true }
    })

    if (!user || !user.stores.length) {
      return NextResponse.json({ message: 'User or store not found' }, { status: 404 })
    }

    const storeId = user.stores[0].id

    // Get current month's start and end dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    // Calculate Total Revenue (sum of all sales in current month)
    const salesData = await prisma.sale.findMany({
      where: {
        storeId: storeId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      include: {
        items: true
      }
    })

    const totalRevenue = salesData.reduce((total, sale) => {
      const saleTotal = sale.items.reduce((saleSum, item) => {
        return saleSum + (item.sellPrice * item.quantity)
      }, 0)
      return total + saleTotal
    }, 0)

    // Calculate Total Expenses (sum of cost price of all products based on initial quantity)
    const products = await prisma.product.findMany({
      where: {
        storeId: storeId
      }
    })

    const totalExpenses = products.reduce((total, product) => {
      return total + (product.price * product.quantity)
    }, 0)

    // Calculate Low Stock Alerts (products with availableQuantity <= 10)
    const lowStockAlerts = products.filter(product => product.availableQuantity <= 10).length

    // Calculate total debts (placeholder - set to 0 if no debt system implemented)
    // If you want to implement debts later, uncomment the following lines:
    const debts = await prisma.debt.findMany({
      where: {
        storeId: storeId
      }
    })
    const totalDebts = debts.reduce((total, debt) => total + debt.amount, 0)
    
    

    return NextResponse.json({
      totalRevenue,
      totalExpenses,
      totalDebts,
      lowStockAlerts,
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' })
    })
  } catch (error) {
    console.error('Error fetching KPI data:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}