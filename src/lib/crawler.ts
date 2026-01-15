import * as cheerio from 'cheerio';

export interface NewsItem {
    title: string;
    link: string;
    source?: string;
    summary?: string;
    id: string;
    timeAgo?: string;
}

export async function crawlHadaIo(page: number = 1): Promise<NewsItem[]> {
    try {
        const response = await fetch(`https://news.hada.io/?page=${page}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 60 } // Cache for 60 seconds
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

            // Extract time info. Usually it's in .topicdesc, something like "1시간 전"
            // The structure is often: source | date | ...
            const descText = $(element).find('.topicdesc').text();
            // Simple regex to find "N분 전", "N시간 전", "N일 전"
            const timeMatch = descText.match(/(\d+(분|시간|일)\s?전)/);
            const timeAgo = timeMatch ? timeMatch[0] : '';

            // The link might be relative '/topic?id=...' or absolute.
            const fullLink = link?.startsWith('http') ? link : `https://news.hada.io/${link?.replace(/^\//, '')}`;

            if (title && fullLink) {
                newsItems.push({
                    id: fullLink,
                    title,
                    link: fullLink,
                    source,
                    timeAgo
                });
            }
        });

        return newsItems;
    } catch (error) {
        console.error('Error crawling news.hada.io:', error);
        return [];
    }
}
