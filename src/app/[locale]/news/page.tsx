import React from 'react';
import { NewsList } from '@/components/news-list';
import { HotTopics } from '@/components/hot-topics';
import styles from './news.module.css';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useTranslations } from 'next-intl';

export default function NewsPage() {
    const t = useTranslations('News');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{t('title')}</h1>
                        <p className={styles.subtitle}>
                            {t('subtitle')}
                        </p>
                    </div>
                    <HotTopics />
                </aside>
                <main className={styles.main}>
                    <NewsList />
                </main>
            </div>
        </div>
    );
}
