'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink,
    Clock,
    AlertCircle,
    RefreshCw,
    MessageSquare,
    Send,
    Plus,
    X,
    User as UserIcon,
    Reply
} from 'lucide-react';
import { Skeleton, Alert } from '@mantine/core';
import { useSession } from 'next-auth/react';
import styles from '@/app/[locale]/news/news.module.css';

interface NewsItem {
    id: string | number;
    title: string;
    url: string;
    source?: string;
    timeAgo?: string;
    summary?: string;
    isUserPost?: boolean;
    createdAt?: string;
    commentCount?: number;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    parentId?: string | null;
    user: {
        name: string;
        image?: string;
    };
    replies?: Comment[];
}

const buildCommentTree = (comments: Comment[]) => {
    const commentMap: { [key: string]: Comment } = {};
    const roots: Comment[] = [];

    // First pass: create map and initialize replies
    comments.forEach(c => {
        commentMap[c.id] = { ...c, replies: [] };
    });

    // Second pass: link children to parents
    comments.forEach(c => {
        if (c.parentId && commentMap[c.parentId]) {
            commentMap[c.parentId].replies?.push(commentMap[c.id]);
        } else {
            roots.push(commentMap[c.id]);
        }
    });

    return roots;
};

const CommentItem = ({
    comment,
    newsId,
    onReply,
    replyingTo,
    onCancelReply,
    onSubmitReply,
    newComment,
    setNewComment
}: {
    comment: Comment;
    newsId: string | number;
    onReply: (id: string) => void;
    replyingTo: string | null;
    onCancelReply: () => void;
    onSubmitReply: (parentId: string) => void;
    newComment: string;
    setNewComment: (val: string) => void;
}) => {
    return (
        <div style={{ fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 700 }}>{comment.user.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                    {new Date(comment.createdAt).toLocaleString()}
                </span>
            </div>
            <p style={{ color: 'var(--foreground)' }}>{comment.content}</p>

            {/* Reply Button */}
            <button
                onClick={() => onReply(comment.id)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.8rem',
                    padding: 0,
                    marginTop: '0.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                }}
            >
                <Reply size={12} /> Reply
            </button>

            {/* Reply Form */}
            {replyingTo === comment.id && (
                <div style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a reply..."
                            style={{
                                flex: 1,
                                padding: '0.4rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--background)',
                                color: 'var(--foreground)'
                            }}
                            autoFocus
                        />
                        <button
                            onClick={() => onSubmitReply(comment.id)}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Send
                        </button>
                        <button
                            onClick={onCancelReply}
                            style={{
                                background: 'var(--muted)',
                                color: 'white',
                                border: 'none',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginLeft: '1.5rem', marginTop: '1rem', borderLeft: '2px solid var(--border)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            newsId={newsId}
                            onReply={onReply}
                            replyingTo={replyingTo}
                            onCancelReply={onCancelReply}
                            onSubmitReply={onSubmitReply}
                            newComment={newComment}
                            setNewComment={setNewComment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function NewsList() {
    const t = useTranslations('News');
    const { data: session } = useSession();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Post Creation State
    const [showPostForm, setShowPostForm] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [posting, setPosting] = useState(false);

    // Comment State
    const [activeCommentsId, setActiveCommentsId] = useState<string | number | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const logClick = useCallback(async (title: string, url: string) => {
        try {
            await fetch('/api/track-click', {
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
            const res = await fetch(`/api/news?page=${pageNum}`);
            if (!res.ok) throw new Error('Failed to fetch news');
            const data = await res.json();
            setNews(data.news || []);
            setTotalPages(data.totalPages || 1);
            setLastUpdated(new Date());
        } catch (err: any) {
            setError(err.message || 'Failed to load news.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!postTitle.trim() || !postContent.trim()) return;
        setPosting(true);
        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: postTitle, content: postContent }),
            });
            if (!res.ok) throw new Error('Failed to create post');

            setPostTitle('');
            setPostContent('');
            setShowPostForm(false);
            fetchNews(1); // Refresh
            alert(t('postSuccess'));
        } catch (err) {
            alert(t('postError'));
        } finally {
            setPosting(false);
        }
    };

    const fetchComments = async (newsId: string | number) => {
        setCommentLoading(true);
        try {
            const res = await fetch(`/api/comments?newsId=${newsId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(buildCommentTree(data));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCommentLoading(false);
        }
    };

    const handlePostComment = async (newsId: string | number, parentId: string | null = null) => {
        if (!newComment.trim()) return;
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newsId, content: newComment, parentId }),
            });
            if (res.ok) {
                setNewComment('');
                setReplyingTo(null);
                fetchComments(newsId);
                // Update local news comment count
                setNews(prev => prev.map(item =>
                    item.id === newsId ? { ...item, commentCount: (item.commentCount || 0) + 1 } : item
                ));
            }
        } catch (e) {
            alert(t('commentError'));
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
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                    {lastUpdated && `${t('lastUpdated')}: ${lastUpdated.toLocaleTimeString()}`}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {session && (
                        <button
                            onClick={() => setShowPostForm(!showPostForm)}
                            className={styles.postBtn}
                            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                        >
                            {showPostForm ? <X size={16} /> : <Plus size={16} />}
                            {t('writePost')}
                        </button>
                    )}
                    <button
                        onClick={() => fetchNews(page)}
                        className={styles.actionBtn}
                        disabled={loading}
                    >
                        <RefreshCw size={14} className={loading ? styles.spin : ''} /> {t('refresh')}
                    </button>
                </div>
            </div>

            {/* Post Creation Form */}
            <AnimatePresence>
                {showPostForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.postFormCard}
                        style={{ overflow: 'hidden', marginBottom: '2rem' }}
                    >
                        <form onSubmit={handleCreatePost} style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <input
                                className={styles.input}
                                placeholder={t('postTitle')}
                                value={postTitle}
                                onChange={e => setPostTitle(e.target.value)}
                                required
                                style={{ marginBottom: '1rem', width: '100%' }}
                            />
                            <textarea
                                className={styles.textarea}
                                placeholder={t('postContent')}
                                value={postContent}
                                onChange={e => setPostContent(e.target.value)}
                                required
                                style={{ marginBottom: '1rem', width: '100%', minHeight: '150px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" disabled={posting} className={styles.submitBtn} style={{ padding: '0.5rem 1.5rem' }}>
                                    {posting ? t('loading') : t('postSubmit')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {error ? (
                <Alert icon={<AlertCircle size={16} />} title="Error" color="red" variant="filled">
                    {error}
                </Alert>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                                <div className={`${styles.card} ${item.isUserPost ? styles.userPost : ''}`}>
                                    <div className={styles.cardHeader}>
                                        <h2 className={styles.cardTitle}>
                                            {item.isUserPost ? (
                                                <span>{item.title}</span>
                                            ) : (
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => logClick(item.title, item.url)}>
                                                    {item.title}
                                                </a>
                                            )}
                                        </h2>
                                    </div>

                                    <div className={styles.cardMeta}>
                                        <span className={styles.sourceTag}>
                                            {item.isUserPost ? <UserIcon size={12} /> : null}
                                            {item.source || 'GeekNews'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} /> {item.timeAgo || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '')}
                                        </span>
                                    </div>

                                    {item.summary && (
                                        <p className={styles.summary}>
                                            {item.summary}
                                        </p>
                                    )}

                                    <div className={styles.cardFooter}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                className={styles.footerAction}
                                                onClick={() => {
                                                    if (activeCommentsId === item.id) {
                                                        setActiveCommentsId(null);
                                                    } else {
                                                        setActiveCommentsId(item.id);
                                                        fetchComments(item.id);
                                                    }
                                                }}
                                            >
                                                <MessageSquare size={16} /> {item.commentCount || 0} {t('comments')}
                                            </button>
                                        </div>
                                        {!item.isUserPost && (
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => {
                                                    logClick(item.title, item.url);
                                                    window.open(item.url, '_blank');
                                                }}
                                            >
                                                {t('clickToRead')} <ExternalLink size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Comments Section */}
                                    <AnimatePresence>
                                        {activeCommentsId === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className={styles.commentSection}
                                            >
                                                <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
                                                    {session ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                                            <input
                                                                className={styles.input}
                                                                placeholder={t('addComment')}
                                                                value={newComment}
                                                                onChange={e => setNewComment(e.target.value)}
                                                                style={{ flex: 1 }}
                                                            />
                                                            <button
                                                                className={styles.submitBtn}
                                                                onClick={() => handlePostComment(item.id)}
                                                                style={{ padding: '0.5rem 1rem' }}
                                                            >
                                                                <Send size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>Please login to comment.</p>
                                                    )}

                                                    {commentLoading ? (
                                                        <p style={{ fontSize: '0.8rem' }}>{t('loading')}</p>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                            {comments.map(comment => (
                                                                <CommentItem
                                                                    key={comment.id}
                                                                    comment={comment}
                                                                    newsId={item.id}
                                                                    onReply={(id) => setReplyingTo(id)}
                                                                    replyingTo={replyingTo}
                                                                    onCancelReply={() => setReplyingTo(null)}
                                                                    onSubmitReply={(parentId) => handlePostComment(item.id, parentId)}
                                                                    newComment={newComment}
                                                                    setNewComment={setNewComment}
                                                                />
                                                            ))}
                                                            {comments.length === 0 && (
                                                                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>No comments yet.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                </div>
            )}

            {!error && !loading && news.length > 0 && (
                <div className={styles.pagination}>
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className={styles.pageBtn}
                    >
                        ←
                    </button>
                    <span className={styles.pageInfo}>{page} / {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={page >= totalPages}
                        className={styles.pageBtn}
                        style={{ display: page >= totalPages ? 'none' : 'flex' }}
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}
