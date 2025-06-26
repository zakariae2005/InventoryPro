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

    // Get debts from the user's store
    const debts = await prisma.debt.findMany({
      where: {
        storeId: user.stores[0].id // Assuming user has at least one store
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(debts)
  } catch (error) {
    console.error('Error fetching debts:', error)
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
    const { name, type, amount, status, paidAt, notes} = body

    // Validate required fields
    if (!name || !type || !amount) {
      return NextResponse.json({ 
        message: 'Missing required fields: name, type, amount are required' 
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

    // Create the debt
    const debt = await prisma.debt.create({
      data: {
        name,
        amount: parseFloat(amount),
        paidAt,
        notes,
        type: type || 'Untyped',
        status,
        storeId: user.stores[0].id
      }
    })

    return NextResponse.json(debt, { status: 201 })
  } catch (error) {
    console.error('Debt creation error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}