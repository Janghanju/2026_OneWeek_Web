import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const inquiries = await prisma.inquiry.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json({ inquiries });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, answer } = await req.json();

        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: { answer }
        });

        // Simulate email sending
        const user = await prisma.user.findUnique({ where: { id: inquiry.userId } });
        console.log(`[EMAIL SENT] To: ${user?.email}, Subject: Your inquiry has been answered. Content: ${answer}`);

        return NextResponse.json({ inquiry });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
