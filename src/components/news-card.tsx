import React from 'react';
import { NewsItem } from '@/lib/crawler';
import { ExternalLink, MessageSquare, Share2, ThumbsUp, Zap } from 'lucide-react';
import styles from '@/app/news/news.module.css';

interface NewsCardProps {
    item: NewsItem;
    summary?: string;
}

export function NewsCard({ item, summary }: NewsCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                    </a>
                </h3>
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted-foreground)' }}>
                    <ExternalLink size={18} />
                </a>
            </div>

            <div className={styles.cardMeta}>
                {item.source && (
                    <span className={styles.sourceTag}>
                        {item.source}
                    </span>
                )}
                <span>2분 전</span> {/* Mock time */}
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
                <div className={styles.actionBtn}>
                    <Share2 size={16} />
                    <span>공유</span>
                </div>
            </div>
        </div>
    );
}
