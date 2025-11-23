'use client';

import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useTranslations } from 'next-intl';
import { Check, Code, Globe, Smartphone, Zap, Brain, Cloud, Database, Palette, Shield } from "lucide-react";

export default function ServicesPage() {
    const t = useTranslations('Services');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
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
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = 'var(--primary)';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
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
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = 'var(--accent)';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
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

                    {/* Tech Consulting */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#fbbf24';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
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

                    {/* AI/ML Integration */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#8b5cf6';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }}>
                        <Brain size={40} color="#8b5cf6" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>AI/ML Integration</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Intelligent systems powered by cutting-edge machine learning algorithms.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#8b5cf6" /> Model Training</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#8b5cf6" /> API Integration</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#8b5cf6" /> Data Analysis</li>
                        </ul>
                    </div>

                    {/* Cloud & DevOps */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#06b6d4';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }}>
                        <Cloud size={40} color="#06b6d4" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Cloud & DevOps</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Scalable cloud infrastructure and automated deployment pipelines.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#06b6d4" /> AWS/Azure/GCP</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#06b6d4" /> Docker/Kubernetes</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#06b6d4" /> CI/CD Pipelines</li>
                        </ul>
                    </div>

                    {/* API Development */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#10b981';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }}>
                        <Code size={40} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>API Development</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            RESTful and GraphQL APIs with modern authentication and documentation.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> REST/GraphQL</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> OAuth/JWT</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> API Documentation</li>
                        </ul>
                    </div>

                    {/* Database Design */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#f59e0b';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }}>
                        <Database size={40} color="#f59e0b" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Database Design</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Efficient database architecture for SQL and NoSQL databases.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#f59e0b" /> PostgreSQL/MySQL</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#f59e0b" /> MongoDB/Redis</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#f59e0b" /> Schema Optimization</li>
                        </ul>
                    </div>

                    {/* UI/UX Design */}
                    <div style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = '#ec4899';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                    }}>
                        <Palette size={40} color="#ec4899" style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>UI/UX Design</h2>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Beautiful, intuitive interfaces that users love to interact with.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#ec4899" /> Figma/Sketch</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#ec4899" /> User Research</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#ec4899" /> Prototyping</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
