// api/sale/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Find user and their store
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stores: true }
    })

    if (!user || !user.stores.length) {
      return NextResponse.json({ message: 'User or store not found' }, { status: 404 })
    }

    // Get the specific sale
    const sale = await prisma.sale.findFirst({
      where: {
        id: id,
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
      }
    })

    if (!sale) {
      return NextResponse.json({ message: 'Sale not found' }, { status: 404 })
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error fetching sale:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
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

    // Find user and their store
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stores: true }
    })

    if (!user || !user.stores.length) {
      return NextResponse.json({ message: 'User or store not found' }, { status: 404 })
    }

    // Check if sale exists and belongs to user's store
    const existingSale = await prisma.sale.findFirst({
      where: {
        id: id,
        storeId: user.stores[0].id
      },
      include: {
        items: true
      }
    })

    if (!existingSale) {
      return NextResponse.json({ message: 'Sale not found' }, { status: 404 })
    }

    // Update the sale in a transaction
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedSale = await prisma.$transaction(async (tx) => {
      // First, restore the quantities from the old sale items
      await Promise.all(
        existingSale.items.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              availableQuantity: {
                increment: item.quantity
              }
            }
          })
        )
      )

      // Delete old sale items
      await tx.saleItem.deleteMany({
        where: { saleId: id }
      })

      // Update the sale basic info
      const updated = await tx.sale.update({
        where: { id: id },
        data: {
          clientName,
          clientPhone
        }
      })

      // Create new sale items
      await Promise.all(
        items.map(item =>
          tx.saleItem.create({
            data: {
              saleId: id,
              productId: item.productId,
              quantity: parseInt(item.quantity),
              sellPrice: parseFloat(item.sellPrice)
            }
          })
        )
      )

      // Update product quantities with new items
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

      return updated
    })

    // Fetch the complete updated sale
    const completeSale = await prisma.sale.findUnique({
      where: { id: id },
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

    return NextResponse.json(completeSale)
  } catch (error) {
    console.error('Sale update error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Find user and their store
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stores: true }
    })

    if (!user || !user.stores.length) {
      return NextResponse.json({ message: 'User or store not found' }, { status: 404 })
    }

    // Check if sale exists and belongs to user's store
    const existingSale = await prisma.sale.findFirst({
      where: {
        id: id,
        storeId: user.stores[0].id
      },
      include: {
        items: true
      }
    })

    if (!existingSale) {
      return NextResponse.json({ message: 'Sale not found' }, { status: 404 })
    }

    // Delete the sale and restore product quantities
    await prisma.$transaction(async (tx) => {
      // Restore product quantities
      await Promise.all(
        existingSale.items.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              availableQuantity: {
                increment: item.quantity
              }
            }
          })
        )
      )

      // Delete sale items first (due to foreign key constraint)
      await tx.saleItem.deleteMany({
        where: { saleId: id }
      })

      // Delete the sale
      await tx.sale.delete({
        where: { id: id }
      })
    })

    return NextResponse.json({ message: 'Sale deleted successfully' })
  } catch (error) {
    console.error('Sale deletion error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}