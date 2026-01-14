'use client';

import { useState } from 'react';
import { MessageSquare, CheckCircle, User, Lock } from 'lucide-react';
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
        setLoading(true);
        try {
            const res = await fetch('/api/inquiry/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, answer: replyContent }),
            });

            if (!res.ok) throw new Error('Failed');

            const data = await res.json();

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
                <div key={inquiry.id} className={styles.inquiryCard}>
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
                            {inquiry.answer ? 'Answered' : 'Pending'}
                        </span>
                    </div>

                    <p className={styles.inquiryContent}>{inquiry.content}</p>

                    {inquiry.answer && (
                        <div className={styles.answerBox}>
                            <div className={styles.answerTitle}>
                                <CheckCircle size={16} />
                                Admin Answer
                            </div>
                            <p className={styles.answerContent}>{inquiry.answer}</p>
                        </div>
                    )}

                    {isAdmin && !inquiry.answer && (
                        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                            {replyingId === inquiry.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <textarea
                                        className={styles.input}
                                        style={{ minHeight: '100px', resize: 'vertical' }}
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        placeholder="Write your answer..."
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleReplySubmit(inquiry.id)}
                                            disabled={loading}
                                            className={styles.saveBtn}
                                        >
                                            Submit Answer
                                        </button>
                                        <button
                                            onClick={() => setReplyingId(null)}
                                            className={styles.cancelBtn}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setReplyingId(inquiry.id)}
                                    className={styles.editBtn}
                                >
                                    Reply
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
