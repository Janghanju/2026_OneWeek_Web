import React from 'react';
import NewsList from '@/components/news-list';
import { HotTopics } from '@/components/hot-topics';
import styles from './news.module.css';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useTranslations } from 'next-intl';
import { Newspaper } from 'lucide-react';

export default function NewsPage() {
    const t = useTranslations('News');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <div className={styles.container}>
                <div className={styles.headerContent}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        backgroundImage: 'linear-gradient(to right, var(--primary), var(--accent))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent'
                    }}>
                        {t('title')}
                    </h1>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.2rem' }}>
                        {t('desc')}
                    </p>
                </div>

                <aside className={styles.sidebar}>
                    <HotTopics />
                </aside>

                <main className={styles.main}>
                    <NewsList />
                </main>
            </div>
        </div>
    );
}
