// app/api/product/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before using
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, price, sellPrice, quantity, availableQuantity, category, description, image } = body

    // Validate required fields
    if (!name || !price || !sellPrice || !quantity) {
      return NextResponse.json({ 
        message: 'Missing required fields: name, price, sellPrice, quantity are required' 
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

    // Check if product exists and belongs to user's store
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: id, // Use awaited id
        storeId: user.stores[0].id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: id }, // Use awaited id
      data: {
        name,
        price: parseFloat(price),
        sellPrice: parseFloat(sellPrice),
        quantity: parseInt(quantity),
        availableQuantity: availableQuantity ? parseInt(availableQuantity) : parseInt(quantity),
        category: category || 'Uncategorized',
        description: description || null,
        image: image || null,
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before using
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

    // Check if product exists and belongs to user's store
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: id, // Use awaited id
        storeId: user.stores[0].id
      }
    })

    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: id } // Use awaited id
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}