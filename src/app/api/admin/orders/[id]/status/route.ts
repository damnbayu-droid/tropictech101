import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logActivity } from '@/lib/logger'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { status } = await request.json()
        const { id } = await params

        const order = await db.order.update({
            where: { id },
            data: { status },
            include: { user: true } // Include user for logging details if needed
        })

        // Log activity
        await logActivity({
            userId: '00000000-0000-0000-0000-000000000000', // System or Admin ID
            action: 'UPDATE_ORDER_STATUS',
            entity: 'ORDER',
            details: `Order #${order.orderNumber} status updated to ${status}`
        })

        return NextResponse.json({ order })
    } catch (error) {
        console.error('Error updating order status:', error)
        return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
        )
    }
}
