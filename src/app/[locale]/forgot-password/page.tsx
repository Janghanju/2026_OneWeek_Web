'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const t = useTranslations('ForgotPassword');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setIsSuccess(true);
            } else {
                setError(data.error || t('error'));
            }
        } catch (err) {
            setError(t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <main style={{
                maxWidth: '450px',
                margin: '0 auto',
                padding: '8rem 1.5rem 4rem',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    background: 'var(--card)',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    border: '1px solid var(--border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}>
                    {isSuccess ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <CheckCircle size={40} color="#22c55e" />
                            </div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                                {t('successTitle')}
                            </h1>
                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                                {t('successMessage')}
                            </p>
                            <Link
                                href="/login"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}
                            >
                                <ArrowLeft size={18} />
                                {t('backToLogin')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem'
                                }}>
                                    <Mail size={28} color="white" />
                                </div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    {t('title')}
                                </h1>
                                <p style={{ color: 'var(--muted-foreground)' }}>
                                    {t('subtitle')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: 500,
                                        color: 'var(--foreground)'
                                    }}>
                                        {t('email')}
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('emailPlaceholder')}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--foreground)',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                    />
                                </div>

                                {error && (
                                    <div style={{
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444',
                                        marginBottom: '1.5rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        opacity: isLoading ? 0.7 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'opacity 0.2s, transform 0.2s'
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            {t('sending')}
                                        </>
                                    ) : (
                                        t('submit')
                                    )}
                                </button>
                            </form>

                            <div style={{
                                marginTop: '2rem',
                                textAlign: 'center',
                                paddingTop: '1.5rem',
                                borderTop: '1px solid var(--border)'
                            }}>
                                <Link
                                    href="/login"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: 'var(--muted-foreground)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <ArrowLeft size={16} />
                                    {t('backToLogin')}
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
