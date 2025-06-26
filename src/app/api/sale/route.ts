// api/sale/route.ts
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

    // Get sales from the user's store with items and product details
    const sales = await prisma.sale.findMany({
      where: {
        storeId: user.stores[0].id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { clientName, clientPhone, items } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        message: 'At least one item is required' 
      }, { status: 400 })
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.sellPrice) {
        return NextResponse.json({ 
          message: 'Each item must have productId, quantity, and sellPrice' 
        }, { status: 400 })
      }
    }

    // Find user and their store
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stores: true }
    })

    if (!user || !user.stores.length) {
      return NextResponse.json({ message: 'User or store not found' }, { status: 404 })
    }

    // Verify all products exist and belong to the store
    const productIds = items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        storeId: user.stores[0].id
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ 
        message: 'Some products not found or do not belong to your store' 
      }, { status: 400 })
    }

    // Check if products have sufficient quantity
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (product && product.availableQuantity < item.quantity) {
        return NextResponse.json({ 
          message: `Insufficient quantity for product ${product.name}. Available: ${product.availableQuantity}, Requested: ${item.quantity}` 
        }, { status: 400 })
      }
    }

    // Create the sale with items in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create the sale
      const newSale = await tx.sale.create({
        data: {
          clientName,
          clientPhone,
          storeId: user.stores[0].id
        }
      })

      // Create sale items
      const saleItems = await Promise.all(
        items.map(item =>
          tx.saleItem.create({
            data: {
              saleId: newSale.id,
              productId: item.productId,
              quantity: parseInt(item.quantity),
              sellPrice: parseFloat(item.sellPrice)
            }
          })
        )
      )

      // Update product quantities
      await Promise.all(
        items.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              availableQuantity: {
                decrement: parseInt(item.quantity)
              }
            }
          })
        )
      )

      return { ...newSale, items: saleItems }
    })

    // Fetch the complete sale with product details
    const completeSale = await prisma.sale.findUnique({
      where: { id: sale.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(completeSale, { status: 201 })
  } catch (error) {
    console.error('Sale creation error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}