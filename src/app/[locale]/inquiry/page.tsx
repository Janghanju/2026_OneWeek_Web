'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MotionContainer } from "@/components/ui/motion-container";
import { Send, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './inquiry.module.css';
import { useTranslations } from 'next-intl';

export default function InquiryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const t = useTranslations('Contact'); // Reusing Contact translations or add new ones? Let's assume Contact has some generic ones or use hardcoded for now if missing.
    // Actually, I should add Inquiry specific translations later. For now I'll use English/Korean hardcoded or generic keys.

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (status === 'loading') return null;
    if (!session) {
        router.push('/login');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, isPrivate }),
            });

            if (!res.ok) throw new Error('Failed to submit inquiry');

            setSuccess(true);
            setTimeout(() => router.push('/profile'), 2000);
        } catch (err) {
            setError('Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <main className={styles.container}>
                <MotionContainer>
                    <div className={styles.header}>
                        <h1 className={styles.title}>1:1 Inquiry</h1>
                        <p className={styles.subtitle}>We will get back to you as soon as possible.</p>
                    </div>

                    <div className={styles.formCard}>
                        {success ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                <h2>Inquiry Submitted!</h2>
                                <p>Redirecting to your profile...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <AlertCircle size={20} /> {error}
                                    </div>
                                )}

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Title</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        placeholder="What is your inquiry about?"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Content</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        placeholder="Please describe your issue in detail."
                                    />
                                </div>

                                <div className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        id="private"
                                        checked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <label htmlFor="private" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Lock size={16} /> Private Inquiry (Only visible to admins)
                                    </label>
                                </div>

                                <button type="submit" className={styles.submitBtn} disabled={loading}>
                                    {loading ? 'Submitting...' : (
                                        <>
                                            Submit Inquiry <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </MotionContainer>
            </main>
        </div>
    );
}
