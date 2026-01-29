'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Github, Mail, Lock, Loader2 } from 'lucide-react';
import styles from './login.module.css';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const t = useTranslations('Login');

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(t('invalidCredentials'));
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(t('errorOccurred'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubLogin = () => {
        signIn('github', { callbackUrl: '/' });
    };

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Link href="/" className={styles.logo}>
                        One Week
                    </Link>
                    <h1 className={styles.title}>{t('title')}</h1>
                    <p className={styles.subtitle}>{t('subtitle')}</p>
                </div>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleCredentialsLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            <Mail size={18} />
                            {t('email')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            <Lock size={18} />
                            {t('password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={styles.input}
                            required
                        />
                        <Link
                            href="/forgot-password"
                            style={{
                                fontSize: '0.85rem',
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                marginTop: '0.5rem',
                                display: 'inline-block'
                            }}
                        >
                            {t('forgotPassword')}
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className={styles.spinner} />
                                {t('signingIn')}
                            </>
                        ) : (
                            t('signIn')
                        )}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>{t('or')}</span>
                </div>

                <button
                    onClick={handleGithubLogin}
                    className={styles.githubBtn}
                >
                    <Github size={20} />
                    {t('continueWithGithub')}
                </button>

                <button
                    onClick={handleGoogleLogin}
                    className={styles.googleBtn}
                >
                    <Mail size={20} />
                    {t('continueWithGoogle')}
                </button>

                <p className={styles.demoHint}>
                    💡 {t('demoHint')}: <code>user@example.com</code> / <code>password</code>
                </p>

                <p className={styles.demoHint} style={{ marginTop: '1rem', textAlign: 'center' }}>
                    {t('noAccount')} <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{t('signUp')}</Link>
                </p>
            </div>
        </div>
    );
}
