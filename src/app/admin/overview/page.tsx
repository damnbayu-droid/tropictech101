import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

import { RealtimeOverview } from "@/components/admin/overview/RealtimeOverview"
import { SystemControl } from "@/components/admin/overview/SystemControl"
import { OverviewCharts } from "@/components/admin/overview/Charts"
import { ActivityLogPanel } from "@/components/admin/ActivityLogPanel"
import { InfoCenter } from "@/components/admin/overview/InfoCenter"

async function getStats() {
    const [
        totalUsers,
        verifiedUsers,
        totalTransactions,
        revenueData,
        notifications,
        totalProducts,
        totalPackages,
        activeOrders,
        unresolvedConflicts
    ] = await Promise.all([
        db.user.count(),
        db.$queryRaw<{ count: bigint }[]>`SELECT count(*)::bigint as count FROM users WHERE is_verified = true`,
        db.invoice.count(),
        db.invoice.aggregate({
            _sum: { total: true }
        }),
        db.systemNotification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        }),
        db.product.count(),
        db.rentalPackage.count(),
        db.order.count({ where: { status: 'ACTIVE' } }),
        db.inventorySyncLog.count({ where: { conflict: true, resolved: false } })
    ])

    const verifiedCount = Number((verifiedUsers as any)[0]?.count || 0)

    return {
        cards: {
            totalUsers,
            verifiedUsers: verifiedCount,
            totalTransactions,
            totalRevenue: Number(revenueData._sum.total || 0),
            totalProducts,
            totalPackages,
            activeOrders,
            unresolvedConflicts
        },
        notifications
    }
}

export default async function AdminOverviewPage() {
    const data = await getStats()

    // Mock data for charts
    const mockRevenueData = [
        { name: 'Jan', total: 15000000, count: 12 },
        { name: 'Feb', total: 22000000, count: 18 },
        { name: 'Mar', total: 18000000, count: 15 },
        { name: 'Apr', total: 28000000, count: 24 },
        { name: 'May', total: 35000000, count: 32 },
        { name: 'Jun', total: 42000000, count: 38 },
    ]

    const mockUserData = [
        { name: 'Jan', registered: 20, active: 15 },
        { name: 'Feb', registered: 35, active: 28 },
        { name: 'Mar', registered: 45, active: 40 },
        { name: 'Apr', registered: 60, active: 55 },
        { name: 'May', registered: 85, active: 75 },
        { name: 'Jun', registered: 110, active: 95 },
    ]

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight uppercase">Dashboard Overview</h1>
                <p className="text-muted-foreground font-medium italic">Command Center</p>
            </div>

            <RealtimeOverview initialData={data}>
                {/* RealtimeOverview only wraps part of the UI now, we'll keep charts outside for better control */}
            </RealtimeOverview>

            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-8">
                    <OverviewCharts userData={mockUserData} revenueData={mockRevenueData} />
                </div>
                <div className="lg:col-span-4 space-y-8">
                    <SystemControl />
                    <ActivityLogPanel />
                    {/* The InfoCenter is now managed by RealtimeOverview for updates, but we can also put it here if we pass setNotifications */}
                </div>
            </div>
        </div>
    )
}
