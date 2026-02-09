'use client'

import { useState, useEffect } from 'react'
import { StatCards } from './StatCards'
import { InfoCenter } from './InfoCenter'
import { RealtimePoller } from '@/lib/realtime'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RealtimeOverviewProps {
    initialData: {
        cards: any
        notifications: any[]
    }
    children?: React.ReactNode
}

export function RealtimeOverview({ initialData, children }: RealtimeOverviewProps) {
    const [stats, setStats] = useState(initialData.cards)
    const [notifications, setNotifications] = useState(initialData.notifications)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        const poller = new RealtimePoller({
            interval: 30000, // Sync every 30 seconds for admin
            onUpdate: (data) => {
                if (data.adminStats) {
                    setStats(data.adminStats.stats)
                    setNotifications(data.adminStats.notifications)
                }
            }
        })

        const token = localStorage.getItem('token')
        if (token) {
            poller.pollAdminData(token)
        }

        return () => poller.stop()
    }, [])

    const manualRefresh = async () => {
        setIsRefreshing(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setStats(data.stats)
                setNotifications(data.notifications)
            }
        } finally {
            setIsRefreshing(false)
        }
    }

    return (
        <div className="space-y-8">
            {stats.unresolvedConflicts > 0 && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 animate-pulse">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="font-black uppercase tracking-widest text-[10px]">Critical Inventory Conflict</AlertTitle>
                    <AlertDescription className="font-bold flex items-center justify-between">
                        <span>There are {stats.unresolvedConflicts} unresolved inventory conflicts between admin and worker updates.</span>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 text-[10px] font-black uppercase px-4"
                            onClick={() => window.location.href = '/admin/inventory'}
                        >
                            Resolve Now
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex justify-end -mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-black uppercase tracking-widest gap-2 opacity-50 hover:opacity-100"
                    onClick={manualRefresh}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Live Sync Active'}
                </Button>
            </div>

            <StatCards stats={stats} />

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-8">
                    {children}
                </div>
                <div className="lg:col-span-4 space-y-8">
                    <InfoCenter notifications={notifications} />
                </div>
            </div>
        </div>
    )
}
