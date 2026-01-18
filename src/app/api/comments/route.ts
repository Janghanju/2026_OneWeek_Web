import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const newsId = searchParams.get('newsId');

    if (!newsId) {
        return NextResponse.json({ error: "News ID required" }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { newsId: parseInt(newsId) },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { newsId, content, parentId } = await req.json();

        if (!newsId || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                newsId: parseInt(newsId),
                userId: session.user.id,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Comment error:", error);
        return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
    }
}
