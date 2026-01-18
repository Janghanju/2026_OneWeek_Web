import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crawlHadaIo } from "@/lib/crawler";
import { NextResponse } from "next/server";
import { z } from "zod";

const newsSchema = z.object({
    title: z.string().min(2).max(100),
    content: z.string().min(10),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);

    try {
        // 1. Get crawled news
        const crawledNews = await crawlHadaIo(page);

        // 2. Get user posts (only for page 1 for now, or implement pagination)
        const userPosts = await prisma.news.findMany({
            where: { isUserPost: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                user: {
                    select: { name: true, image: true }
                },
                _count: {
                    select: { comments: true }
                }
            }
        });

        // Combine them (user posts first)
        const combinedNews = [
            ...userPosts.map(p => ({
                id: p.id,
                title: p.title,
                summary: p.summary,
                source: p.user?.name || 'User',
                url: `/news/${p.id}`, // Internal link
                isUserPost: true,
                createdAt: p.createdAt,
                commentCount: p._count.comments
            })),
            ...crawledNews.map(n => ({
                ...n,
                url: n.link
            }))
        ];

        return NextResponse.json({ news: combinedNews });
    } catch (error) {
        console.error("News fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validated = newsSchema.parse(body);

        // Create news post
        // We use a unique URL for user posts to avoid conflicts with crawled news
        const news = await prisma.news.create({
            data: {
                title: validated.title,
                summary: validated.content.substring(0, 200),
                source: session.user.name || 'User',
                url: `user-post-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                isUserPost: true,
                userId: session.user.id,
            }
        });

        return NextResponse.json(news);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
        }
        console.error("News post error:", error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
