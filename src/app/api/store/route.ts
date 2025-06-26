// app/api/store/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const stores = await prisma.store.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
  })

  return NextResponse.json(stores)
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const {
      name,
      category,
      description,
      address,
      country,
      city,
      email,
      phone,
      website,
      openingHours,
    } = body

    // Validate required fields
    if (!name || !category || !address || !country || !city) {
      return NextResponse.json(
        { message: 'Missing required fields: name, category, address, country, city are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const store = await prisma.store.create({
      data: {
        name,
        category,
        description: description || null,
        address,
        country,
        city,
        email: email || null,
        phone: phone || null, // Note: phone is required in schema, you might want to make it optional
        website: website || null,
        openingHours: openingHours || null,
        userId: user.id,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error('Store creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}