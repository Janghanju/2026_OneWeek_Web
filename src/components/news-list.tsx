'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
    ExternalLink,
    Clock,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { Skeleton, Alert } from '@mantine/core'; // Keep Skeleton/Alert for now or replace with custom? Let's keep for simplicity but wrap in custom div
import styles from '@/app/[locale]/news/news.module.css';

interface NewsItem {
    id: string;
    title: string;
    link: string;
    source?: string;
    timeAgo?: string;
    summary?: string;
}

export default function NewsList() {
    const t = useTranslations('News');
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Click log function
    const logClick = useCallback(async (title: string, url: string) => {
        try {
            await fetch('/api/click-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword: title, url }),
            });
        } catch (e) {
            console.warn('Click log failed', e);
        }
    }, []);

    const fetchNews = async (pageNum: number, isAutoRefresh = false) => {
        if (!isAutoRefresh) setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/geek-news?page=${pageNum}`);

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const txt = await res.text();
                console.error('Received non-JSON response:', txt.substring(0, 200));
                throw new Error('Server returned unexpected response (not JSON). Please try again later.');
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.details || data.error || 'Failed to fetch news');
            }

            const data = await res.json();
            setNews(data.news || []);
            setTotalPages(data.totalPages || 1);
            setLastUpdated(new Date());
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to load news.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(page);
        const interval = setInterval(() => fetchNews(page, true), 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [page]);

    const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
    const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));

    return (
        <div className={styles.feed}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                <span>
                    {lastUpdated && `${t('lastUpdated')}: ${lastUpdated.toLocaleTimeString()}`}
                </span>
                <button
                    onClick={() => fetchNews(page)}
                    className={styles.actionBtn}
                    disabled={loading}
                >
                    <RefreshCw size={14} /> {t('refresh')}
                </button>
            </div>

            {error ? (
                <Alert icon={<AlertCircle size={16} />} title="Connection Error" color="red" variant="filled">
                    {error}
                </Alert>
            ) : (
                <>
                    {loading && news.length === 0
                        ? Array(6).fill(0).map((_, i) => (
                            <div key={i} className={styles.card} style={{ height: '200px', opacity: 0.5 }}>
                                <Skeleton height={20} radius="md" mb="sm" />
                                <Skeleton height={100} radius="md" />
                            </div>
                        ))
                        : news.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                            >
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h2 className={styles.cardTitle}>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={() => logClick(item.title, item.link)}>
                                                {item.title}
                                            </a>
                                        </h2>
                                    </div>

                                    <div className={styles.cardMeta}>
                                        <span className={styles.sourceTag}>{item.source || 'GeekNews'}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} /> {item.timeAgo}
                                        </span>
                                    </div>

                                    {item.summary && (
                                        <p className={styles.summary}>
                                            {item.summary}
                                        </p>
                                    )}

                                    <div className={styles.cardFooter}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => {
                                                logClick(item.title, item.link);
                                                window.open(item.link, '_blank');
                                            }}
                                        >
                                            Read Article <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </>
            )}

            {!error && !loading && news.length > 0 && (
                <div className={styles.pagination}>
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className={styles.pageBtn}
                        aria-label="Previous Page"
                    >
                        ←
                    </button>
                    <span className={styles.pageInfo}>{page} / {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={page >= totalPages}
                        className={styles.pageBtn}
                        aria-label="Next Page"
                        style={{ display: page >= totalPages ? 'none' : 'flex' }}
                    >
                        →
                    </button>

                </div>
            )}
        </div>
    );
}
