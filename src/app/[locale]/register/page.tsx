'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import styles from '../login/login.module.css';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const t = useTranslations('Register');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError(t('passwordMismatch'));
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t('passwordTooShort'));
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                setIsLoading(false);
                return;
            }

            // Auto login after successful registration
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(t('registrationFailed'));
                setTimeout(() => router.push('/login'), 2000);
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(t('errorOccurred'));
        } finally {
            setIsLoading(false);
        }
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

                <form onSubmit={handleRegister} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>
                            <User size={18} />
                            {t('name')}
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('yourName')}
                            className={styles.input}
                        />
                    </div>

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
                            minLength={6}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            <Lock size={18} />
                            {t('confirmPassword')}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={styles.input}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className={styles.spinner} />
                                {t('creatingAccount')}
                            </>
                        ) : (
                            t('signUp')
                        )}
                    </button>
                </form>

                <p className={styles.demoHint} style={{ marginTop: '1rem', textAlign: 'center' }}>
                    {t('haveAccount')} <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{t('signIn')}</Link>
                </p>
            </div>
        </div>
    );
}
