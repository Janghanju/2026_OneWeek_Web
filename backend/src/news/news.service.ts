import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

export interface NewsItem {
    title: string;
    link: string;
    source?: string;
    summary?: string;
    id: string;
    timeAgo?: string;
}

@Injectable()
export class NewsService {
    private cache: { data: NewsItem[]; timestamp: number } | null = null;
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    async findAll(page: number = 1): Promise<NewsItem[]> {
        // Only cache first page for simplicity, or use a map for pages
        if (page === 1 && this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
            return this.cache.data;
        }

        try {
            const response = await fetch(`https://news.hada.io/?page=${page}`, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch news.hada.io: ${response.statusText}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);
            const newsItems: NewsItem[] = [];

            $('.topic_row').each((_, element) => {
                const titleElement = $(element).find('.topictitle a');
                const title = titleElement.text().trim();
                const link = titleElement.attr('href');
                const source = $(element).find('.topicdesc a').first().text().trim();

                const descText = $(element).find('.topicdesc').text();
                const timeMatch = descText.match(/(\d+(분|시간|일)\s?전)/);
                const timeAgo = timeMatch ? timeMatch[0] : '';

                const fullLink = link?.startsWith('http')
                    ? link
                    : `https://news.hada.io/${link?.replace(/^\//, '')}`;

                if (title && fullLink) {
                    newsItems.push({
                        id: fullLink,
                        title,
                        link: fullLink,
                        source,
                        timeAgo,
                    });
                }
            });

            if (page === 1) {
                this.cache = { data: newsItems, timestamp: Date.now() };
            }

            return newsItems;
        } catch (error) {
            console.error('Error crawling news.hada.io:', error);
            return [];
        }
    }
}
