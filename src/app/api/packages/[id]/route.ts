import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Missing package id' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('packages')
      .select(`
        id,
        name,
        description,
        price,
        duration,
        image_url,
        package_items (
          id,
          quantity,
          product:products (
            name
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Package fetch error:', error)
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      package: {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        imageUrl: data.image_url,
        items: Array.isArray(data.package_items)
          ? data.package_items
          : [],
      },
    })
  } catch (err) {
    console.error('Package API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
