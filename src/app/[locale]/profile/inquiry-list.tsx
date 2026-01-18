'use client';

import { useState } from 'react';
import { MessageSquare, CheckCircle, User, Lock, Send, Reply } from 'lucide-react';
import styles from './profile.module.css';

interface Inquiry {
    id: string;
    title: string;
    content: string;
    answer?: string | null;
    createdAt: Date;
    isPrivate?: boolean;
    user?: {
        name?: string | null;
        email?: string | null;
    };
}

interface InquiryListProps {
    inquiries: Inquiry[];
    isAdmin?: boolean;
}

export function InquiryList({ inquiries: initialInquiries, isAdmin = false }: InquiryListProps) {
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReplySubmit = async (id: string) => {
        if (!replyContent.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/inquiry/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, answer: replyContent }),
            });

            if (!res.ok) throw new Error('Failed');

            // Update local state
            setInquiries(prev => prev.map(inq =>
                inq.id === id ? { ...inq, answer: replyContent } : inq
            ));

            setReplyingId(null);
            setReplyContent('');
        } catch (e) {
            alert('Failed to submit answer');
        } finally {
            setLoading(false);
        }
    };

    if (inquiries.length === 0) {
        return (
            <div className={styles.inquiryCard} style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>No inquiries found.</p>
            </div>
        );
    }

    return (
        <div className={styles.inquiryList}>
            {inquiries.map((inquiry) => (
                <div key={inquiry.id} className={styles.inquiryCard} style={{
                    borderLeft: inquiry.answer ? '4px solid #10b981' : '4px solid #3b82f6',
                    padding: '1.5rem'
                }}>
                    <div className={styles.inquiryHeader}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h4 className={styles.inquiryTitle}>{inquiry.title}</h4>
                                {inquiry.isPrivate && <Lock size={14} color="var(--muted-foreground)" />}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>
                                <span className={styles.inquiryDate}>
                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                </span>
                                {isAdmin && inquiry.user && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <User size={12} /> {inquiry.user.name} ({inquiry.user.email})
                                    </span>
                                )}
                            </div>
                        </div>
                        <span className={`${styles.statusBadge} ${inquiry.answer ? styles.statusAnswered : styles.statusPending}`}>
                            {inquiry.answer ? 'Resolved' : 'Waiting'}
                        </span>
                    </div>

                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                    }}>
                        <p style={{ color: 'var(--foreground)' }}>{inquiry.content}</p>
                    </div>

                    {inquiry.answer && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(16, 185, 129, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(16, 185, 129, 0.1)',
                            marginLeft: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#10b981',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                marginBottom: '0.5rem'
                            }}>
                                <Reply size={14} style={{ transform: 'scaleX(-1)' }} />
                                Admin Response
                            </div>
                            <p style={{ color: 'var(--foreground)', fontSize: '0.95rem' }}>{inquiry.answer}</p>
                        </div>
                    )}

                    {isAdmin && (
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            {replyingId === inquiry.id ? (
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <textarea
                                        className={styles.input}
                                        style={{ minHeight: '100px', resize: 'vertical', background: 'var(--background)' }}
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        placeholder="Write your response..."
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => setReplyingId(null)}
                                            className={styles.cancelBtn}
                                            style={{ padding: '0.5rem 1rem' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleReplySubmit(inquiry.id)}
                                            disabled={loading}
                                            className={styles.saveBtn}
                                            style={{ padding: '0.5rem 1rem', background: '#10b981' }}
                                        >
                                            {loading ? 'Sending...' : 'Send Response'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setReplyingId(inquiry.id);
                                        setReplyContent(inquiry.answer || '');
                                    }}
                                    className={styles.editBtn}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                    <Reply size={14} /> {inquiry.answer ? 'Edit Response' : 'Reply'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
