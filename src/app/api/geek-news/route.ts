import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';

    try {
        // Proxy to NestJS Backend
        const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:3001';
        const res = await fetch(`${backendUrl}/geek-news?page=${page}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`Backend responded with ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Proxy error:', error);
        return NextResponse.json({
            error: 'Failed to fetch news from backend',
            details: error.message,
            cause: error.cause
        }, { status: 500 });
    }
}
