'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Lock, ArrowLeft, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
    const t = useTranslations('ResetPassword');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError(t('invalidToken'));
        }
    }, [token, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t('passwordMismatch'));
            return;
        }

        if (password.length < 6) {
            setError(t('passwordTooShort'));
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
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

    if (!token && !error) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
            </div>
        );
    }

    return (
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
                            display: 'inline-block',
                            padding: '0.875rem 2rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}
                    >
                        {t('goToLogin')}
                    </Link>
                </div>
            ) : (
                <>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <Lock size={28} color="white" />
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            {t('title')}
                        </h1>
                        <p style={{ color: 'var(--muted-foreground)' }}>
                            {t('subtitle')}
                        </p>
                    </div>

                    {error && !token ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                marginBottom: '1.5rem'
                            }}>
                                {error}
                            </div>
                            <Link
                                href="/forgot-password"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}
                            >
                                {t('requestNewLink')}
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 500
                                }}>
                                    {t('newPassword')}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t('newPasswordPlaceholder')}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 3rem 0.875rem 1rem',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--background)',
                                            color: 'var(--foreground)',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--muted-foreground)'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 500
                                }}>
                                    {t('confirmPassword')}
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t('confirmPasswordPlaceholder')}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--background)',
                                        color: 'var(--foreground)',
                                        fontSize: '1rem',
                                        outline: 'none'
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
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    opacity: isLoading ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        {t('resetting')}
                                    </>
                                ) : (
                                    t('submit')
                                )}
                            </button>
                        </form>
                    )}

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
    );
}

export default function ResetPasswordPage() {
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
                <Suspense fallback={
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </main>
        </div>
    );
}
