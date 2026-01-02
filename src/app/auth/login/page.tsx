'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      toast.error('Invalid login credentials')
      setLoading(false)
      return
    }

    // 🔐 cek role admin
    const role = data.user.user_metadata?.role

    if (role !== 'ADMIN') {
      await supabase.auth.signOut()
      toast.error('Access denied')
      setLoading(false)
      return
    }

    toast.success('Welcome back')
    router.push('/dashboard/admin')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
