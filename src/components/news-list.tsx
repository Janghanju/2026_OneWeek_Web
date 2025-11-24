'use client';

import React, { useEffect, useState } from 'react';
import { NewsItem } from '@/lib/crawler';
import { NewsCard } from './news-card';
import styles from '@/app/[locale]/news/news.module.css';
import { RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { MotionContainer } from './ui/motion-container';
import { MotionCard } from './ui/motion-card';
import { useRouter, useSearchParams } from 'next/navigation';

export function NewsList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [page, setPage] = useState(currentPage);

    // Sync page state with URL
    useEffect(() => {
        setPage(currentPage);
    }, [currentPage]);

    const fetchNews = async (pageNum: number, isAutoRefresh = false) => {
        if (!isAutoRefresh) setLoading(true);
        try {
            const res = await fetch(`/api/news?page=${pageNum}`);
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
        fetchNews(page);

        // Auto refresh every 60 seconds
        const interval = setInterval(() => {
            fetchNews(page, true);
        }, 60000);

        return () => clearInterval(interval);
    }, [page]);

    const handleTrackClick = async (keyword: string, url: string) => {
        try {
            await fetch('/api/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword, url })
            });
        } catch (err) {
            console.error('Failed to track click', err);
        }
    };

    const goToPage = (newPage: number) => {
        if (newPage < 1) return;
        router.push(`/news?page=${newPage}`);
    };

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
                    onClick={() => fetchNews(page)}
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

            <MotionContainer>
                {news.map((item) => (
                    <MotionCard key={item.id}>
                        <NewsCard item={item} onTrackClick={handleTrackClick} />
                    </MotionCard>
                ))}
            </MotionContainer>

            <div className={styles.pagination}>
                {/* First page button - only show if not on page 1 */}
                {page > 1 && (
                    <button
                        onClick={() => goToPage(1)}
                        className={styles.pageBtn}
                        title="첫 페이지"
                    >
                        <ChevronsLeft size={16} />
                    </button>
                )}

                {/* Previous page button - only show if not on page 1 */}
                {page > 1 && (
                    <button
                        onClick={() => goToPage(page - 1)}
                        className={styles.pageBtn}
                        title="이전 페이지"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}

                <span className={styles.pageInfo}>페이지 {page}</span>

                {/* Next page button - always show */}
                <button
                    onClick={() => goToPage(page + 1)}
                    className={styles.pageBtn}
                    title="다음 페이지"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
