import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

@Injectable()
export class GeekNewsService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Run crawling immediately on startup
        this.crawlAndSave();
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async crawlAndSave() {
        console.log('Starting GeekNews crawling...');
        try {
            const response = await fetch('https://news.hada.io', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            if (!response.ok) throw new Error(`Failed to fetch GeekNews: ${response.status} ${response.statusText}`);

            const html = await response.text();
            console.log(`Fetched HTML length: ${html.length}`);

            const $ = cheerio.load(html);

            const items: { title: string; url: string; summary: string; source: string }[] = [];

            $('.topic_row').each((_, el) => {
                const titleEl = $(el).find('.topictitle a');
                const title = titleEl.text().trim();
                const url = titleEl.attr('href');
                const summary = $(el).find('.topicdesc').text().trim();
                const source = $(el).find('.topicinfo').text().split(' ')[0] || 'GeekNews';

                if (title && url) {
                    const fullUrl = url.startsWith('http') ? url : `https://news.hada.io${url.startsWith('/') ? '' : '/'}${url}`;
                    items.push({ title, url: fullUrl, summary, source });
                }
            });

            console.log(`Found ${items.length} items.`);

            if (items.length === 0) {
                console.log('HTML Preview:', html.substring(0, 500));
            }

            for (const item of items) {
                await this.prisma.news.upsert({
                    where: { url: item.url },
                    update: {
                        title: item.title,
                        summary: item.summary,
                        source: item.source,
                    },
                    create: {
                        title: item.title,
                        url: item.url,
                        summary: item.summary,
                        source: item.source,
                    },
                });
            }
            console.log(`Successfully saved/updated ${items.length} items to DB.`);

        } catch (error) {
            console.error('GeekNews crawling failed:', error);
        }
    }

    async findAll(page = 1) {
        const take = 20;
        const skip = (page - 1) * take;

        const [news, total] = await Promise.all([
            this.prisma.news.findMany({
                take,
                skip,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.news.count(),
        ]);

        return {
            news: news.map(n => ({
                id: n.id.toString(),
                title: n.title,
                link: n.url,
                source: n.source,
                timeAgo: n.createdAt.toISOString(), // Simplified
                summary: n.summary
            })),
            total,
            page,
            totalPages: Math.ceil(total / take),
        };
    }
}
