import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from './profile.module.css';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MessageSquare, LayoutDashboard, Settings, Bell, ShieldCheck, MessageCircle, Clock } from 'lucide-react';
import { ProfileEditor } from './profile-editor';
import { InquiryList } from './inquiry-list';

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        redirect(`/${locale}/login`);
    }

    const isAdmin = session.user.role === 'ADMIN';

    // Fetch data with safety checks
    let inquiries: any[] = [];
    let commentCount = 0;
    let recentComments: any[] = [];

    try {
        const [inqData, countData, commentData] = await Promise.all([
            prisma.inquiry.findMany({
                where: isAdmin ? {} : { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            }),
            prisma.comment.count({
                where: { userId: session.user.id }
            }),
            prisma.comment.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
                take: 3,
                include: {
                    news: {
                        select: { title: true }
                    }
                }
            })
        ]);
        inquiries = inqData;
        commentCount = countData;
        recentComments = commentData;
    } catch (error) {
        console.error("Failed to fetch profile data:", error);
    }

    // Stats for dashboard feel
    const stats = [
        { label: 'Inquiries', value: inquiries.length, icon: <MessageSquare size={20} /> },
        { label: 'Comments', value: commentCount, icon: <MessageCircle size={20} /> },
        { label: 'Status', value: isAdmin ? 'Admin' : 'Active', icon: <ShieldCheck size={20} /> },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>User Dashboard</h1>
                    <p className={styles.subtitle}>Welcome back, {session.user.name || 'User'}</p>
                </div>

                {/* Dashboard Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {stats.map((stat, i) => (
                        <div key={i} style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{stat.label}</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.grid}>
                    {/* Left Column: Profile & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <ProfileEditor user={session.user} />

                        {/* Quick Actions */}
                        <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Settings size={18} /> Quick Actions
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <a href={`/${locale}/inquiry`} style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textDecoration: 'none', color: 'var(--foreground)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={16} /> New Inquiry
                                </a>
                                <a href={`/${locale}/news`} style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textDecoration: 'none', color: 'var(--foreground)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <LayoutDashboard size={16} /> Latest News
                                </a>
                            </div>
                        </div>

                        {/* Recent Activity (Comments) */}
                        {!isAdmin && recentComments.length > 0 && (
                            <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={18} /> Recent Comments
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {recentComments.map((comment, i) => (
                                        <div key={i} style={{ fontSize: '0.85rem', borderLeft: '2px solid var(--primary)', paddingLeft: '0.75rem' }}>
                                            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>On: {comment.news.title}</p>
                                            <p style={{ color: 'var(--foreground)' }}>"{comment.content}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Inquiries */}
                    <div className={styles.inquirySection}>
                        <h3 className={styles.sectionTitle}>
                            <MessageSquare size={24} className="text-blue-500" />
                            {isAdmin ? 'Admin Inquiry Dashboard' : 'Inquiry History'}
                        </h3>

                        <InquiryList inquiries={inquiries} isAdmin={isAdmin} />
                    </div>
                </div>
            </div>
        </div>
    );
}
