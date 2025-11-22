import * as cheerio from 'cheerio';

export interface NewsItem {
    title: string;
    link: string;
    source?: string;
    summary?: string;
    id: string;
}

export async function crawlHadaIo(): Promise<NewsItem[]> {
    try {
        const response = await fetch('https://news.hada.io/', {
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

        // Select news items. Based on typical structure of GeekNews (news.hada.io)
        // Usually items are in a list. Let's inspect the structure from the read_url_content output or assume standard structure.
        // The previous read_url_content didn't give HTML structure, just text.
        // I'll assume a generic selector and if it fails, I'll debug.
        // Common structure for such sites: .topic_row, .item, etc.
        // Let's try to be broad or check if I can see the HTML structure.
        // Since I can't see the HTML structure directly from previous output (it was text),
        // I will try to find '.topic_row' which is common in GeekNews (Gnews) clones or similar.
        // Actually, looking at the text content "Zensical - ...", it looks like a list of titles.

        // Let's try to select generic links first to see what we get, or better, 
        // I'll use a more robust selector if I can guess it. 
        // GeekNews usually uses `.topic_row` or similar.

        $('.topic_row').each((_, element) => {
            const titleElement = $(element).find('.topictitle a');
            const title = titleElement.text().trim();
            const link = titleElement.attr('href');
            const source = $(element).find('.topicdesc a').first().text().trim();

            // The link might be relative '/topic?id=...' or absolute.
            // If relative, prepend domain.
            const fullLink = link?.startsWith('http') ? link : `https://news.hada.io${link}`;

            if (title && fullLink) {
                newsItems.push({
                    id: fullLink, // Use link as ID for now
                    title,
                    link: fullLink,
                    source
                });
            }
        });

        // If .topic_row doesn't work, let's try a fallback to just 'a' tags with specific characteristics
        if (newsItems.length === 0) {
            console.log("Fallback crawling strategy...");
            // This is a guess, but often main links are in h1, h2, h3 or have specific classes
            // Let's try to just dump what we find if we find nothing.
        }

        return newsItems;
    } catch (error) {
        console.error('Error crawling news.hada.io:', error);
        return [];
    }
}
