'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function Hero() {
  const { t } = useLanguage()
  const [imageOpacity, setImageOpacity] = useState(50)
  const [sliderOpacity, setSliderOpacity] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Slider appears after 1 second for better TBT
    const sliderTimer = setTimeout(() => {
      setSliderOpacity(100)
    }, 1000)

    return () => {
      clearTimeout(sliderTimer)
    }
  }, [])

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.webp"
          alt="Tropic Tech Workstation Rental Bali"
          fill
          className="object-cover transition-opacity duration-[3000ms] ease-in-out"
          style={{ opacity: mounted ? imageOpacity / 100 : 0 }}
          priority
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div
        className={cn(
          "relative z-10 text-center px-4 max-w-4xl mx-auto transition-opacity duration-[3000ms] ease-in-out",
          mounted ? "opacity-100" : "opacity-0"
        )}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-slate-700 dark:text-slate-300 font-medium">
          {t('subtitle')}
        </p>
        <p className="text-lg md:text-xl mb-8 text-slate-600 dark:text-slate-400">
          {t('subtitle2')}
        </p>
        <div className="flex flex-col items-center gap-4 mt-16 md:mt-32">
          <Button
            size="lg"
            className="text-lg px-8 py-4 h-auto font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-md overflow-hidden group relative"
            onClick={scrollToProducts}
            aria-label="Scroll to workstation rentals"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative z-10">{t('rentNow')}</span>
          </Button>
        </div>
      </div>

      {/* Opacity Control Slider - Repositioned for mobile accessibility */}
      <div
        className={cn(
          "absolute transition-opacity duration-[3000ms] ease-in-out z-20",
          // Mobile: center-top with more spacing to avoid header
          "top-24 md:top-1/2 left-1/2 md:left-auto md:right-4 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2",
          "flex md:flex-col items-center gap-3 bg-background/20 backdrop-blur-xl p-3 md:p-4 rounded-full shadow-2xl border border-white/10",
          sliderOpacity === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div className="md:h-40 flex items-center">
          <Slider
            value={[imageOpacity]}
            onValueChange={(value) => setImageOpacity(value[0])}
            min={0}
            max={100}
            step={5}
            orientation={mounted && window.innerWidth < 768 ? "horizontal" : "vertical"}
            className="w-32 md:w-2"
            aria-label="Background image opacity"
          />
        </div>
        <span className="text-xs font-bold text-primary min-w-[3ch] text-center">
          {imageOpacity}%
        </span>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section >
  )
}
