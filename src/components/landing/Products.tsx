'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ProductCard from './ProductCard'
import { Button } from '@/components/ui/button'

const categories = [
  'All',
  'Desks',
  'Monitors',
  'Chairs',
  'Keyboard & Mouse',
  'Accessories',
]

const categoryMap: Record<string, string> = {
  All: 'All',
  Desks: 'desks',
  Monitors: 'monitors',
  Chairs: 'chairs',
  'Keyboard & Mouse': 'keyboardMouse',
  Accessories: 'accessories',
}

export default function Products({
  onOrder,
}: {
  onOrder: (productId: string, duration: number) => void
}) {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) return

      const data = await res.json()
      let filtered = data

      if (selectedCategory !== 'All') {
        filtered = data.filter(
          (p: any) => p.category === categoryMap[selectedCategory]
        )
      }

      setProducts(filtered)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  return (
    <section id="products" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          {t('products')}
        </h2>

        {/* CATEGORY */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category === 'All'
                ? 'All'
                : t(categoryMap[category] || category)}
            </Button>
          ))}
        </div>

        {/* HORIZONTAL SCROLL — MOBILE FIRST */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] xl:w-[22%]"
            >
              <ProductCard
                product={product}
                onOrder={onOrder}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
