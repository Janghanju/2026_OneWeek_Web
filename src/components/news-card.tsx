'use client';

import React from 'react';
import { NewsItem } from '@/lib/crawler';
import { ExternalLink, MessageSquare, Share2, ThumbsUp, Zap } from 'lucide-react';
import styles from '@/app/[locale]/news/news.module.css';

interface NewsCardProps {
    item: NewsItem;
    summary?: string;
    onTrackClick?: (keyword: string, url: string) => void;
}

export function NewsCard({ item, summary, onTrackClick }: NewsCardProps) {
    const handleLinkClick = () => {
        if (onTrackClick) {
            onTrackClick(item.title, item.link);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(item.link);
            alert('링크가 복사되었습니다!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                        {item.title}
                    </a>
                </h3>
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-foreground)' }} onClick={handleLinkClick}>
                    <ExternalLink size={18} />
                </a>
            </div>

            <div className={styles.cardMeta}>
                {item.source && (
                    <span className={styles.sourceTag}>
                        {item.source}
                    </span>
                )}
                {item.timeAgo && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                        {item.timeAgo}
                    </span>
                )}
            </div>

            {summary ? (
                <div className={styles.summary}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
                        <Zap size={16} fill="currentColor" />
                        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>AI 요약</span>
                    </div>
                    {summary}
                </div>
            ) : (
                <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                    기사 원문을 확인하려면 클릭하세요...
                </div>
            )}

            <div className={styles.cardFooter}>
                <div className={styles.actionBtn}>
                    <ThumbsUp size={16} />
                    <span>좋아요</span>
                </div>
                <div className={styles.actionBtn}>
                    <MessageSquare size={16} />
                    <span>댓글 0</span>
                </div>
                <div className={styles.actionBtn} onClick={handleShare}>
                    <Share2 size={16} />
                    <span>공유</span>
                </div>
            </div>
        </div>
    );
}