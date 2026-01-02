'use client'

import { useState } from 'react'
import ChatButton from '@/components/ChatButton'
import ChatWidget from '@/components/ChatWidget'
import dynamic from 'next/dynamic'
import Header from '@/components/header/Header'
import Hero from '@/components/landing/Hero'
import Products from '@/components/landing/Products'
import Packages from '@/components/landing/Packages'
import Services from '@/components/landing/Services'
import FAQ from '@/components/landing/FAQ'
import AboutUs from '@/components/landing/AboutUs'
import Reviews from '@/components/landing/Reviews'
import Footer from '@/components/landing/Footer'

// Dynamically import OrderPopup to avoid hydration issues with useAuth
const OrderPopup = dynamic(() => import('@/components/landing/OrderPopup'), {
  ssr: false,
})

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

  // 🔹 CHAT STATE (DITAMBAHKAN, TIDAK MENGGANGGU YANG LAIN)
  const [chatOpen, setChatOpen] = useState(false)

const handleProductOrder = (productId: string, duration: number) => {
  fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(data => {
      // 🔒 SAFETY CHECK (INI YANG SEBELUMNYA HILANG)
      if (!data || !data.product) {
        console.error('Product data invalid:', data)
        return
      }

      const monthlyPrice =
        typeof data.product.monthlyPrice === 'number'
          ? data.product.monthlyPrice
          : 0

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
    .catch(error => {
      console.error('Failed to fetch product:', error)
    })
}


  const handlePackageOrder = (packageId: string) => {
    fetch(`/api/packages/${packageId}`)
      .then(res => res.json())
      .then(data => {
        setOrderItem({
          type: 'PACKAGE',
          id: packageId,
          name: data.package.name,
          price: data.package.price,
          duration: data.package.duration,
        })
        setIsOrderPopupOpen(true)
      })
      .catch(error => {
        console.error('Failed to fetch package:', error)
      })
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
        <Products onOrder={handleProductOrder} />
        <Packages onOrder={handlePackageOrder} />
        <Services />
        <FAQ />
        <AboutUs />
        <Reviews />
      </main>

      <Footer />

      {isOrderPopupOpen && orderItem && (
        <OrderPopup
          isOpen={isOrderPopupOpen}
          onClose={handleCloseOrderPopup}
          item={orderItem}
        />
      )}

      {/* STRUCTURED DATA SEO (TETAP) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Tropic Tech - PT Tropic Tech International",
            "description": "Professional workstation and office equipment rental in Bali. Serving digital nomads and remote workers for 5+ years.",
            "url": "https://tropictechbali.com",
            "telephone": "+6282266574860",
            "email": "tropictechindo@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Jl. Tunjungsari No.8",
              "addressLocality": "Bali",
              "addressCountry": "Indonesia"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -8.409518,
              "longitude": 115.188919
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            },
            "priceRange": "Rp 75,000 - Rp 2,000,000 / day",
            "image": "https://i.ibb.co.com/Pzbsg8mx/2.jpg",
            "sameAs": [
              "https://www.instagram.com/tropictechs",
              "https://wa.me/6282266574860"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "100+",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* 🔹 CHATBOT (DITAMBAHKAN) */}
      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatWidget
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  )
}
