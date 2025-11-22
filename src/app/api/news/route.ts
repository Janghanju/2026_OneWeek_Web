import { NextResponse } from 'next/server';
import { crawlHadaIo } from '@/lib/crawler';

export async function GET() {
    try {
        const news = await crawlHadaIo();
        return NextResponse.json({ news });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
