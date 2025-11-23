import { Navbar } from "@/components/navbar";
import { useTranslations } from 'next-intl';
import { Check, Code, Globe, Smartphone, Zap } from "lucide-react";

export default function ServicesPage() {
    const t = useTranslations('Services');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
            <Navbar />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, var(--primary), var(--accent))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {t('title')}
                    </h1>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.2rem' }}>
                        Premium solutions for your digital needs.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Web Development */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease'
                    }}>
                        <Globe size={40} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{t('webDev')}</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            {t('webDevDesc')}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="var(--primary)" /> Next.js 14+</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="var(--primary)" /> SEO Optimization</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="var(--primary)" /> Performance Tuning</li>
                        </ul>
                    </div>

                    {/* App Development */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease'
                    }}>
                        <Smartphone size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{t('appDev')}</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            {t('appDevDesc')}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="var(--accent)" /> React Native</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="var(--accent)" /> iOS & Android</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="var(--accent)" /> Native Modules</li>
                        </ul>
                    </div>

                    {/* Consulting */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease'
                    }}>
                        <Zap size={40} color="#fbbf24" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{t('consulting')}</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            {t('consultingDesc')}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#fbbf24" /> Architecture Design</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#fbbf24" /> Code Review</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#fbbf24" /> Tech Stack Selection</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
