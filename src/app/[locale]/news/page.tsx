import React from 'react';
import { NewsList } from '@/components/news-list';
import styles from './news.module.css';
import { Flame, Hash, LayoutGrid, MessageCircle, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useTranslations } from 'next-intl';

export default function NewsPage() {
    const t = useTranslations('Navbar'); // Using Navbar namespace for now as placeholder

    return (
        <div className={styles.container}>
            <Navbar />
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Tech Insight</h1>
                    <p className={styles.subtitle}>
                        Real-time Developer News & Community
                    </p>
                </div>
            </header>

            <aside className={styles.sidebar}>
                <div className={`${styles.navItem} ${styles.active}`}>
                    <LayoutGrid size={20} />
                    <span>All News</span>
                </div>
                <div className={styles.navItem}>
                    <Flame size={20} />
                    <span>Popular</span>
                </div>
                <div className={styles.navItem}>
                    <MessageCircle size={20} />
                    <span>Discussions</span>
                </div>
                <div className={styles.navItem}>
                    <Hash size={20} />
                    <span>Tags</span>
                </div>
            </aside>

            <main>
                <NewsList />
            </main>

            <aside>
                <div className={styles.trending}>
                    <div className={styles.trendingTitle}>
                        <TrendingUp size={20} color="var(--primary)" />
                        <span>Trending Keywords</span>
                    </div>
                    <div className={styles.trendingItem}>
                        <span className={styles.trendingRank}>1</span> React 19
                    </div>
                    <div className={styles.trendingItem}>
                        <span className={styles.trendingRank}>2</span> Next.js App Router
                    </div>
                    <div className={styles.trendingItem}>
                        <span className={styles.trendingRank}>3</span> AI Agent
                    </div>
                    <div className={styles.trendingItem}>
                        <span className={styles.trendingRank}>4</span> TypeScript 5.5
                    </div>
                    <div className={styles.trendingItem}>
                        <span className={styles.trendingRank}>5</span> Rust
                    </div>
                </div>
            </aside>
        </div>
    );
}
