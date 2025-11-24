import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const inquiries = await prisma.inquiry.findMany({
            where: {
                userId: session.user.id
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

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content, isPrivate } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const inquiry = await prisma.inquiry.create({
            data: {
                title,
                content,
                isPrivate: isPrivate ?? true,
                userId: session.user.id!
            }
        });

        return NextResponse.json({ inquiry });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
