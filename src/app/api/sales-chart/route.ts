// api/sales-chart/route.ts
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

    // Get current year and create array of 12 months
    const currentYear = new Date().getFullYear()
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i, 1)
      return {
        monthIndex: i,
        monthName: date.toLocaleDateString('en-US', { month: 'short' }),
        fullMonthName: date.toLocaleDateString('en-US', { month: 'long' }),
        year: currentYear
      }
    })

    // Get sales data for each month of the current year
    const salesData = await Promise.all(
      months.map(async (month) => {
        const startOfMonth = new Date(currentYear, month.monthIndex, 1)
        startOfMonth.setHours(0, 0, 0, 0)
        
        const endOfMonth = new Date(currentYear, month.monthIndex + 1, 0)
        endOfMonth.setHours(23, 59, 59, 999)

        // Get sales for this month
        const sales = await prisma.sale.findMany({
          where: {
            storeId: storeId,
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        })

        // Calculate revenue for this month (from sales)
        const monthlyRevenue = sales.reduce((total, sale) => {
          const saleTotal = sale.items.reduce((saleSum, item) => {
            return saleSum + (item.sellPrice * item.quantity)
          }, 0)
          return total + saleTotal
        }, 0)

        // Calculate expenses as TOTAL INVENTORY COST only for the current month
        let totalInventoryCost = 0
        
        // Only show inventory cost in the current month
        const currentMonth = new Date().getMonth()
        const isCurrentMonth = month.monthIndex === currentMonth
        
        if (isCurrentMonth) {
          // Get all products that exist currently
          const allProducts = await prisma.product.findMany({
            where: {
              storeId: storeId
            }
          })

          // Calculate total inventory cost (costPrice × quantity for all products)
          totalInventoryCost = allProducts.reduce((total, product) => {
            // Use costPrice if available, otherwise fall back to price
            const costPrice =  product.price
            return total + (costPrice * product.quantity)
          }, 0)
        }

        return {
          date: month.monthName,
          fullDate: `${month.fullMonthName} ${currentYear}`,
          revenue: Math.round(monthlyRevenue * 100) / 100,
          expenses: Math.round(totalInventoryCost * 100) / 100, // Total inventory cost
          salesCount: sales.length,
          monthIndex: month.monthIndex
        }
      })
    )

    return NextResponse.json(salesData)
  } catch (error) {
    console.error('Error fetching sales chart data:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}