import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth/utils'

export const dynamic = 'force-dynamic'

/**
 * Get overall admin dashboard statistics
 * Refreshed in real-time by the dashboard
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.substring(7)
        const payload = await verifyToken(token)

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

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
            db.user.count({ where: { isVerified: true } }),
            db.invoice.count(),
            db.invoice.aggregate({
                _sum: { total: true }
            }),
            db.systemNotification.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            db.product.count(),
            db.rentalPackage.count(),
            db.order.count({ where: { status: 'ACTIVE' } }),
            db.inventorySyncLog.count({ where: { conflict: true, resolved: false } })
        ])

        return NextResponse.json({
            stats: {
                totalUsers,
                verifiedUsers,
                totalTransactions,
                totalRevenue: Number(revenueData._sum.total || 0),
                totalProducts,
                totalPackages,
                activeOrders,
                unresolvedConflicts
            },
            notifications
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        )
    }
}
