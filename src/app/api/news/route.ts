import { NextResponse } from 'next/server';
import { crawlHadaIo } from '@/lib/crawler';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);

    try {
        const news = await crawlHadaIo(page);
        return NextResponse.json({ news });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
