'use client';

import React, { useEffect, useState } from 'react';
import { NewsItem } from '@/lib/crawler';
import { NewsCard } from './news-card';
import styles from '@/app/[locale]/news/news.module.css';
import { RefreshCw } from 'lucide-react';

export function NewsList() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchNews = async (isAutoRefresh = false) => {
        if (!isAutoRefresh) setLoading(true);
        try {
            const res = await fetch('/api/news');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setNews(data.news || []);
            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
            setError('뉴스를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();

        // Auto refresh every 60 seconds
        const interval = setInterval(() => {
            fetchNews(true);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    if (loading && news.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>뉴스 불러오는 중...</div>;
    }

    if (error) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;
    }

    return (
        <div className={styles.feed}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                    마지막 업데이트: {lastUpdated.toLocaleTimeString()}
                </span>
                <button
                    onClick={() => fetchNews()}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <RefreshCw size={14} /> 새로고침
                </button>
            </div>

            {news.map((item) => (
                <NewsCard key={item.id} item={item} />
            ))}
        </div>
    );
}
