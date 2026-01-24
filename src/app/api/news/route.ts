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
    const source = searchParams.get('source') || 'all'; // 'all', 'db', 'crawl'
    const pageSize = 20;

    try {
        // Get total count for pagination
        const totalDbNews = await prisma.news.count();
        const totalPages = Math.max(1, Math.ceil(totalDbNews / pageSize));

        if (source === 'crawl') {
            // Only crawled news (live from external source)
            const crawledNews = await crawlHadaIo(page);
            return NextResponse.json({
                news: crawledNews.map(n => ({
                    ...n,
                    url: n.link,
                    commentCount: 0
                })),
                totalPages: 10, // Estimated for crawled source
                currentPage: page,
                source: 'crawl'
            });
        }

        // Get news from DB with pagination
        const dbNews = await prisma.news.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                user: {
                    select: { name: true, image: true }
                },
                _count: {
                    select: { comments: true }
                }
            }
        });

        const newsItems: Array<{
            id: number | string;
            title: string;
            summary: string | null | undefined;
            source: string | null | undefined;
            url: string;
            isUserPost: boolean;
            createdAt?: Date;
            timeAgo?: string;
            commentCount: number;
        }> = dbNews.map(p => ({
            id: p.id,
            title: p.title,
            summary: p.summary,
            source: p.isUserPost ? (p.user?.name || 'User') : p.source,
            url: p.isUserPost ? `/news/${p.id}` : p.url,
            isUserPost: p.isUserPost,
            createdAt: p.createdAt,
            commentCount: p._count.comments
        }));

        // If DB has less than half a page, supplement with crawled news
        if (newsItems.length < pageSize / 2 && source !== 'db') {
            const crawledNews = await crawlHadaIo(1);
            const crawledItems = crawledNews.slice(0, pageSize - newsItems.length).map(n => ({
                id: n.id,
                title: n.title,
                summary: n.summary,
                source: n.source,
                url: n.link,
                isUserPost: false,
                timeAgo: n.timeAgo,
                commentCount: 0
            }));
            newsItems.push(...crawledItems);
        }

        return NextResponse.json({
            news: newsItems,
            totalPages,
            currentPage: page,
            totalCount: totalDbNews,
            source: 'db'
        });
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
