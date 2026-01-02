import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // 🔹 ambil dari endpoint products utama (source yang sama)
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    const products = await res.json()

    const product = Array.isArray(products)
      ? products.find((p: any) => p.id === id)
      : null

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
