'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

import ChatButton from '@/components/ChatButton'
import Header from '@/components/header/Header'
import Hero from '@/components/landing/Hero'

// NON-CRITICAL (LAZY)
const Products = dynamic(() => import('@/components/landing/Products'), { ssr: false })
const Packages = dynamic(() => import('@/components/landing/Packages'), { ssr: false })
const Services = dynamic(() => import('@/components/landing/Services'), { ssr: false })
const AboutUs = dynamic(() => import('@/components/landing/AboutUs'), { ssr: false })
const FAQ = dynamic(() => import('@/components/landing/FAQ'), { ssr: false })
const Reviews = dynamic(() => import('@/components/landing/Reviews'), { ssr: false })
const Footer = dynamic(() => import('@/components/landing/Footer'), { ssr: false })

const OrderPopup = dynamic(() => import('@/components/landing/OrderPopup'), { ssr: false })
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false })

interface OrderItem {
  type: 'PRODUCT' | 'PACKAGE'
  id: string
  name: string
  price: number
  duration?: number
}

export default function Home() {
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null)
  const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const handleProductOrder = (productId: string, duration: number) => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.product) return
        const monthlyPrice = typeof data.product.monthlyPrice === 'number' ? data.product.monthlyPrice : 0
        const dailyPrice = monthlyPrice / 30
        setOrderItem({
          type: 'PRODUCT',
          id: productId,
          name: data.product.name || 'Selected Product',
          price: dailyPrice * duration,
          duration,
        })
        setIsOrderPopupOpen(true)
      })
      .catch(console.error)
  }

  const handlePackageOrder = (packageId: string) => {
    fetch(`/api/packages/${packageId}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.package) return
        setOrderItem({
          type: 'PACKAGE',
          id: packageId,
          name: data.package.name,
          price: data.package.price,
          duration: data.package.duration,
        })
        setIsOrderPopupOpen(true)
      })
      .catch(console.error)
  }

  const handleCloseOrderPopup = () => {
    setIsOrderPopupOpen(false)
    setOrderItem(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        {/* CONTENT VISIBILITY — AMAN */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
          <Products onOrder={handleProductOrder} />
        </div>

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
          <Packages onOrder={handlePackageOrder} />
        </div>

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <Services />
        </div>

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <AboutUs />
        </div>

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <FAQ />
        </div>

        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
          <Reviews />
        </div>
      </main>

      <Footer />

      {isOrderPopupOpen && orderItem && (
        <OrderPopup
          isOpen={isOrderPopupOpen}
          onClose={handleCloseOrderPopup}
          item={orderItem}
        />
      )}

      <ChatButton onClick={() => setChatOpen(true)} />
      {chatOpen && <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />}
    </div>
  )
}
