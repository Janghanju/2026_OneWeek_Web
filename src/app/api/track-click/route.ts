import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { keyword, url } = await request.json();

        if (!keyword || !url) {
            return NextResponse.json({ error: 'Missing keyword or url' }, { status: 400 });
        }

        await prisma.clickLog.create({
            data: {
                keyword,
                url
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Track click error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
