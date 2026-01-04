'use client';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Check, Code, Globe, Smartphone, Zap, Brain, Cloud, Database, Palette, Shield } from "lucide-react";
import { useTranslations } from 'next-intl';
import { MotionCard } from "@/components/ui/motion-card";
import { MotionContainer } from "@/components/ui/motion-container";

export default function ServicesPage() {
    const t = useTranslations('Services');

    const services = [
        { icon: <Globe size={40} color="var(--primary)" />, title: t('webDevTitle'), desc: t('webDevDesc'), color: 'var(--primary)', features: [t('webDevFeature1'), t('webDevFeature2'), t('webDevFeature3')] },
        { icon: <Smartphone size={40} color="var(--accent)" />, title: t('appDevTitle'), desc: t('appDevDesc'), color: 'var(--accent)', features: [t('appDevFeature1'), t('appDevFeature2'), t('appDevFeature3')] },
        { icon: <Zap size={40} color="#fbbf24" />, title: t('consultingTitle'), desc: t('consultingDesc'), color: '#fbbf24', features: [t('consultingFeature1'), t('consultingFeature2'), t('consultingFeature3')] },
        { icon: <Brain size={40} color="#8b5cf6" />, title: t('aiTitle'), desc: t('aiDesc'), color: '#8b5cf6', features: [t('aiFeature1'), t('aiFeature2'), t('aiFeature3')] },
        { icon: <Cloud size={40} color="#06b6d4" />, title: t('cloudTitle'), desc: t('cloudDesc'), color: '#06b6d4', features: [t('cloudFeature1'), t('cloudFeature2'), t('cloudFeature3')] },
        { icon: <Code size={40} color="#10b981" />, title: t('apiTitle'), desc: t('apiDesc'), color: '#10b981', features: [t('apiFeature1'), t('apiFeature2'), t('apiFeature3')] },
        { icon: <Database size={40} color="#f59e0b" />, title: t('dbTitle'), desc: t('dbDesc'), color: '#f59e0b', features: [t('dbFeature1'), t('dbFeature2'), t('dbFeature3')] },
        { icon: <Palette size={40} color="#ec4899" />, title: t('uiTitle'), desc: t('uiDesc'), color: '#ec4899', features: [t('uiFeature1'), t('uiFeature2'), t('uiFeature3')] },
        { icon: <Shield size={40} color="#ef4444" />, title: t('securityTitle'), desc: t('securityDesc'), color: '#ef4444', features: [t('securityFeature1'), t('securityFeature2'), t('securityFeature3')] }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title')}</h1>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.2rem' }}>{t('subtitle')}</p>
                </div>
                <MotionContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {services.map((svc, idx) => (
                        <MotionCard key={idx}>
                            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', transition: 'transform 0.3s ease, border-color 0.3s ease', height: '100%' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = svc.color; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                                {svc.icon}
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{svc.title}</h2>
                                <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>{svc.desc}</p>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {svc.features.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color={svc.color} />{f}</li>
                                    ))}
                                </ul>
                            </div>
                        </MotionCard>
                    ))}
                </MotionContainer>
            </main>
        </div>
    );
}