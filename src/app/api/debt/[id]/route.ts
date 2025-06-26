// app/api/debt/[id]/route.ts
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
    const { name, type, amount, status, paidAt, notes } = body

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

    // Check if debt exists and belongs to user's store
    const existingDebt = await prisma.debt.findFirst({
      where: {
        id: id, // Use awaited id
        storeId: user.stores[0].id
      }
    })

    if (!existingDebt) {
      return NextResponse.json({ message: 'Debt not found' }, { status: 404 })
    }

    // Update the debt
    const updatedDebt = await prisma.debt.update({
      where: { id: id }, // Use awaited id
      data: {
        name,
        amount: parseFloat(amount),
        paidAt,
        notes,
        type: type || 'Untyped',
        status,
      }
    })

    return NextResponse.json(updatedDebt)
  } catch (error) {
    console.error('Debt update error:', error)
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

    // Check if debt exists and belongs to user's store
    const existingDebt = await prisma.debt.findFirst({
      where: {
        id: id, // Use awaited id
        storeId: user.stores[0].id
      }
    })

    if (!existingDebt) {
      return NextResponse.json({ message: 'Debt not found' }, { status: 404 })
    }

    // Delete the debt
    await prisma.debt.delete({
      where: { id: id } // Use awaited id
    })

    return NextResponse.json({ message: 'Debt deleted successfully' })
  } catch (error) {
    console.error('Debt deletion error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}