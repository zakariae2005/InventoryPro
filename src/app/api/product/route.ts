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

    // First find the user to get their store
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { stores: true }
    })

    if (!user || !user.stores.length) {
      return NextResponse.json({ message: 'User or store not found' }, { status: 404 })
    }

    // Get products from the user's store
    const products = await prisma.product.findMany({
      where: {
        storeId: user.stores[0].id // Assuming user has at least one store
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
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

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        sellPrice: parseFloat(sellPrice),
        quantity: parseInt(quantity),
        availableQuantity: availableQuantity ? parseInt(availableQuantity) : parseInt(quantity),
        category: category || 'Uncategorized',
        description: description || null,
        image: image || null,
        storeId: user.stores[0].id
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}