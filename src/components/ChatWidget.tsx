'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi 👋 Welcome to Tropic Tech.\n\nWe provide professional work equipment rental in Bali, including desks, ergonomic chairs, monitors, and complete workstation packages.\n\nHow can I help you today?',
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            typeof data.reply === 'string'
              ? data.reply
              : 'Thanks for your message. How can I assist you further?',
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong. Please try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[90vw] rounded-xl border bg-background shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold">Tropic Tech Support</div>
        <button onClick={onClose} aria-label="Close chat">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-2 rounded-lg whitespace-pre-line ${
              msg.role === 'user'
                ? 'ml-auto bg-primary text-white'
                : 'bg-muted'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage()
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-md bg-primary px-3 text-white disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
