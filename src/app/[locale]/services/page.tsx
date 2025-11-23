'use client';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Check, Code, Globe, Smartphone, Zap, Brain, Cloud, Database, Palette, Shield } from "lucide-react";
import { useTranslations } from 'next-intl';
import { MotionCard } from "@/components/ui/motion-card";

export default function ServicesPage() {
    const t = useTranslations('Services');

    const services = [
        { icon: <Globe size={40} color="var(--primary)" />, title: 'Web Development', desc: 'High-performance, responsive websites built with Next.js.', color: 'var(--primary)', features: ['Next.js 14+', 'SEO Optimization', 'Performance Tuning'] },
        { icon: <Smartphone size={40} color="var(--accent)" />, title: 'App Development', desc: 'Cross-platform mobile apps using React Native.', color: 'var(--accent)', features: ['React Native', 'iOS & Android', 'Native Modules'] },
        { icon: <Zap size={40} color="#fbbf24" />, title: 'Tech Consulting', desc: 'Expert advice on your tech stack and architecture.', color: '#fbbf24', features: ['Architecture Design', 'Code Review', 'Tech Stack Selection'] },
        { icon: <Brain size={40} color="#8b5cf6" />, title: 'AI/ML Integration', desc: 'Intelligent systems powered by machine learning.', color: '#8b5cf6', features: ['Model Training', 'API Integration', 'Data Analysis'] },
        { icon: <Cloud size={40} color="#06b6d4" />, title: 'Cloud & DevOps', desc: 'Scalable cloud infrastructure and automated pipelines.', color: '#06b6d4', features: ['AWS/Azure/GCP', 'Docker/Kubernetes', 'CI/CD Pipelines'] },
        { icon: <Code size={40} color="#10b981" />, title: 'API Development', desc: 'RESTful and GraphQL APIs with modern authentication.', color: '#10b981', features: ['REST/GraphQL', 'OAuth/JWT', 'API Documentation'] },
        { icon: <Database size={40} color="#f59e0b" />, title: 'Database Design', desc: 'Efficient database architecture for SQL and NoSQL.', color: '#f59e0b', features: ['PostgreSQL/MySQL', 'MongoDB/Redis', 'Schema Optimization'] },
        { icon: <Palette size={40} color="#ec4899" />, title: 'UI/UX Design', desc: 'Beautiful, intuitive interfaces that users love.', color: '#ec4899', features: ['Figma/Sketch', 'User Research', 'Prototyping'] },
        { icon: <Shield size={40} color="#ef4444" />, title: 'Cybersecurity', desc: 'Secure your applications with modern security practices.', color: '#ef4444', features: ['Penetration Testing', 'Secure Code Review', 'Compliance Audits'] }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title')}</h1>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.2rem' }}>{t('subtitle')}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {services.map((svc, idx) => (
                        <MotionCard key={idx} index={idx}>
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
                </div>
            </main>
        </div>
    );
}