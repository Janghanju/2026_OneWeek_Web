import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Get top 5 keywords in the last 24 hours
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

        const logs = await prisma.clickLog.groupBy({
            by: ['keyword'],
            where: {
                createdAt: {
                    gte: yesterday
                }
            },
            _count: {
                keyword: true
            },
            orderBy: {
                _count: {
                    keyword: 'desc'
                }
            },
            take: 5
        });

        const hotTopics = logs.map((log, index) => ({
            rank: index + 1,
            keyword: log.keyword,
            count: log._count.keyword
        }));

        // If not enough data, return some defaults or empty
        if (hotTopics.length === 0) {
            return NextResponse.json({
                topics: [
                    { rank: 1, keyword: "AI", count: 0 },
                    { rank: 2, keyword: "Next.js", count: 0 },
                    { rank: 3, keyword: "React", count: 0 },
                    { rank: 4, keyword: "TypeScript", count: 0 },
                    { rank: 5, keyword: "Web", count: 0 }
                ]
            });
        }

        return NextResponse.json({ topics: hotTopics });
    } catch (error) {
        console.error('Hot topics error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
