'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Globe, Sun, Moon } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO — JANGAN DIUBAH */}
          <Link href="/" prefetch={false} className="text-2xl font-bold text-primary">
            Tropic Tech
          </Link>

          {/* RIGHT CTA */}
          <nav className="flex items-center gap-3">
            <Link
              href="/auth/signup"
              prefetch={false}
              className="px-4 py-2 rounded-md border hover:bg-accent transition"
            >
              Sign Up
            </Link>

            <Link
              href="/auth/login"
              prefetch={false}
              className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/90 transition"
            >
              Login
            </Link>

            <ThemeLanguageButton />
          </nav>
        </div>
      </div>
    </header>
  )
}

/* ===================================================== */
/* THEME + LANGUAGE BUTTON (SELF CONTAINED, SAFE, DUMMY) */
/* ===================================================== */

function ThemeLanguageButton() {
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)
  const holdTimer = useRef<NodeJS.Timeout | null>(null)

  const LANGUAGES = [
    'English',
    'Bahasa Indonesia',
    'Deutsch',
    'Français',
    'Español',
    'Italiano',
    'Português',
    'Русский',
    '日本語',
    'العربية',
  ]

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    const dark = html.classList.toggle('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    setIsDark(dark)
  }

  const onMouseDown = () => {
    holdTimer.current = setTimeout(() => setOpen(true), 600)
  }

  const onMouseUp = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
  }

  const onClick = () => {
    if (!open) toggleTheme()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={onClick}
        className="p-2 rounded-md hover:bg-accent transition"
        aria-label="Theme and language"
      >
        <Globe className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="px-3 py-2 text-xs text-muted-foreground border-b">
            Languages (UI only)
          </div>
          {LANGUAGES.map((lang) => (
            <div
              key={lang}
              className="px-4 py-2 text-sm hover:bg-accent cursor-pointer"
            >
              {lang}
            </div>
          ))}
          <div className="border-t px-4 py-2 text-xs flex items-center gap-2">
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </div>
        </div>
      )}
    </div>
  )
}
