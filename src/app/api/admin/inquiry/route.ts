import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendInquiryAnswerEmail } from "@/lib/email";
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

        // Get user info for notification and email
        const user = await prisma.user.findUnique({ where: { id: inquiry.userId } });

        if (user) {
            // Create in-app notification
            await prisma.notification.create({
                data: {
                    type: 'INQUIRY_ANSWER',
                    title: '문의 답변 도착',
                    message: `"${inquiry.title}" 문의에 대한 답변이 등록되었습니다.`,
                    link: '/profile',
                    userId: user.id
                }
            });

            // Send email notification
            if (user.email) {
                await sendInquiryAnswerEmail(user.email, inquiry.title, answer);
            }
        }

        return NextResponse.json({ inquiry });
    } catch (error) {
        console.error("Inquiry answer error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
