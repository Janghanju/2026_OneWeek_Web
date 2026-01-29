import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch notifications for the current user
export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        const unreadCount = await prisma.notification.count({
            where: { userId: session.user.id, isRead: false }
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error: any) {
        // If notification table doesn't exist yet, return empty data gracefully
        if (error.code === 'P2021' || error.message?.includes('does not exist')) {
            return NextResponse.json({ notifications: [], unreadCount: 0 });
        }
        console.error("Notification fetch error:", error);
        return NextResponse.json({ notifications: [], unreadCount: 0 });
    }
}

// PUT: Mark notifications as read
export async function PUT(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { notificationIds, markAllRead } = await req.json();

        if (markAllRead) {
            await prisma.notification.updateMany({
                where: { userId: session.user.id, isRead: false },
                data: { isRead: true }
            });
        } else if (notificationIds && Array.isArray(notificationIds)) {
            await prisma.notification.updateMany({
                where: {
                    id: { in: notificationIds },
                    userId: session.user.id
                },
                data: { isRead: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notification update error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// DELETE: Delete a notification
export async function DELETE(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Missing notification ID" }, { status: 400 });
        }

        await prisma.notification.delete({
            where: { id, userId: session.user.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notification delete error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
