'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'zh' | 'hi' | 'es' | 'ar' | 'fr' | 'pt' | 'ru' | 'id'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

/* =========================
   TRANSLATIONS (TIDAK DIUBAH)
========================= */
const translations: Record<Language, Record<string, string>> = {
  en: {
    signUp: 'Sign Up',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    cart: 'Cart',
    title: 'Tropic Tech',
    subtitle: 'Workstation Rental Company',
    subtitle2: '5+ Years in Bali and Leading the Industry',
    rentNow: 'Rent Now',
    desks: 'Desks',
    monitors: 'Monitors',
    chairs: 'Chairs',
    keyboardMouse: 'Keyboard & Mouse',
    accessories: 'Accessories',
    order: 'Order',
    daily: 'Daily',
    monthly: 'Monthly',
    orderPopup: 'Order',
    rentalDuration: 'Rental Duration',
    unitPrice: 'Unit Price',
    totalPrice: 'Total Price',
    currency: 'Currency',
    selectPaymentMethod: 'Select Payment Method',
    paypal: 'PayPal / EDC / Debit / Credit Card',
    stripe: 'Stripe / Crypto',
    whatsapp: 'Order via WhatsApp',
    formspree: 'Submit Order',
    cash: 'Cash',
    placeOrder: 'Place Order',
    cancel: 'Cancel',
    selectCurrency: 'Select Currency',
    products: 'Products',
    packages: 'Packages',
    services: 'Services',
    faq: 'FAQ',
    aboutUs: 'About Us',
    reviews: 'Reviews',
    allRightsReserved: 'All Rights Reserved',
    getInTouch: 'Get in Touch',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    refundPolicy: 'Refund Policy',
    credits: 'Design by indodesign.website | indonesianvisas.com | balihelp.id | mybisnis.app',
  },

  zh: { /* ISI SAMA SEPERTI FILE ASLIMU */ },
  hi: { /* ISI SAMA SEPERTI FILE ASLIMU */ },
  es: { /* ISI SAMA SEPERTI FILE ASLIMU */ },
  ar: { /* ISI SAMA SEPERTI FILE ASLIMU */ },
  fr: { /* ISI SAMA SEPERTI FILE ASLIMU */ },
  pt: { /* ISI SAMA SEPERTI FILE ASLIMU */ },
  ru: { /* ISI SAMA SEPERTI FILE ASLIMU */ },
  id: { /* ISI SAMA SEPERTI FILE ASLIMU */ },
}

/* ========================= */

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const languageNames: Record<Language, string> = {
  en: 'English',
  zh: '中文',
  hi: 'हिन्दी',
  es: 'Español',
  ar: 'العربية',
  fr: 'Français',
  pt: 'Português',
  ru: 'Русский',
  id: 'Bahasa Indonesia',
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  /* =========================
     LOAD LANGUAGE ON FIRST LOAD
     (SEO SAFE, NO API, NO I18N)
  ========================= */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedLang = localStorage.getItem('lang') as Language | null

    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang)
      document.documentElement.lang = savedLang
    } else {
      document.documentElement.lang = 'en'
    }
  }, [])

  /* =========================
     SET LANGUAGE (GLOBAL)
  ========================= */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return { ...context, languageNames }
}
