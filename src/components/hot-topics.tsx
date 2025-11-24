'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/[locale]/news/news.module.css';
import { Flame, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Topic {
    rank: number;
    keyword: string;
    count: number;
}

export function HotTopics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const t = useTranslations('News');

    useEffect(() => {
        fetch('/api/hot-topics')
            .then(res => res.json())
            .then(data => setTopics(data.topics || []))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className={styles.trendingBox}>
            <div className={styles.trendingHeader}>
                <TrendingUp size={20} color="var(--primary)" />
                <h3>{t('hotTopics')}</h3>
                <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.75rem',
                    color: 'var(--accent)',
                    fontWeight: 600,
                    background: 'rgba(var(--accent-rgb), 0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px'
                }}>
                    {t('top5')}
                </span>
            </div>
            {topics.map((topic) => (
                <div key={topic.rank} className={styles.trendingItem}>
                    <span className={styles.trendingRank}>#{topic.rank}</span>
                    <span className={styles.trendingKeyword}>{topic.keyword}</span>
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--muted-foreground)',
                        marginLeft: 'auto'
                    }}>
                        {topic.count > 0 ? `${topic.count}${t('times')}` : ''}
                    </span>
                    {topic.rank <= 3 && <Flame size={14} color="#ef4444" fill="#ef4444" />}
                </div>
            ))}
        </div>
    );
}
