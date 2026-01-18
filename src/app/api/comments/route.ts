import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const newsIdParam = searchParams.get('newsId');

    if (!newsIdParam) {
        return NextResponse.json({ error: "News ID required" }, { status: 400 });
    }

    try {
        let newsId: number;

        // Check if newsIdParam is a number
        const parsedId = parseInt(newsIdParam);
        if (!isNaN(parsedId) && parsedId.toString() === newsIdParam) {
            newsId = parsedId;
        } else {
            // It's a URL (crawled news)
            const news = await prisma.news.findUnique({
                where: { url: newsIdParam }
            });

            if (!news) {
                // News not found in DB, so no comments yet
                return NextResponse.json([]);
            }
            newsId = news.id;
        }

        const comments = await prisma.comment.findMany({
            where: { newsId },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Fetch comments error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { newsId: newsIdParam, content, parentId, title } = await req.json();

        if (!newsIdParam || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        let newsId: number;

        // Check if newsIdParam is a number
        if (typeof newsIdParam === 'number') {
            newsId = newsIdParam;
        } else if (!isNaN(parseInt(newsIdParam)) && parseInt(newsIdParam).toString() === newsIdParam) {
            newsId = parseInt(newsIdParam);
        } else {
            // It's a URL (crawled news)
            // Try to find existing news
            let news = await prisma.news.findUnique({
                where: { url: newsIdParam }
            });

            if (!news) {
                if (!title) {
                    return NextResponse.json({ error: "Title required for new news item" }, { status: 400 });
                }
                // Create new news record
                news = await prisma.news.create({
                    data: {
                        title,
                        url: newsIdParam,
                        source: 'GeekNews', // Default source for crawled items
                        isUserPost: false,
                        summary: 'Community discussion'
                    }
                });
            }
            newsId = news.id;
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                newsId,
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
