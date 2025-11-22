import { NextResponse } from 'next/server';
import { crawlHadaIo } from '@/lib/crawler';

export async function GET() {
    try {
        const news = await crawlHadaIo();
        return NextResponse.json({ count: news.length, news });
    } catch (error) {
        console.error('Crawl failed:', error);
        return NextResponse.json({ error: 'Failed to crawl' }, { status: 500 });
    }
}
