import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from './profile.module.css';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MessageSquare, LayoutDashboard, Settings, Bell, ShieldCheck, MessageCircle, Clock, Crown, Zap, Star, Gem, Cpu, Plus } from 'lucide-react';
import { ProfileEditor } from './profile-editor';
import { InquiryList } from './inquiry-list';

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        redirect(`/${locale}/login`);
    }

    // Fetch full user data from DB to get latest membership and devices
    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            membership: true,
            devices: true,
        }
    });

    if (!dbUser) {
        redirect(`/${locale}/login`);
    }

    const isAdmin = dbUser.role === 'ADMIN';

    // Fetch data with safety checks
    let inquiries: any[] = [];
    let commentCount = 0;
    let recentComments: any[] = [];

    try {
        const [inqData, countData, commentData] = await Promise.all([
            prisma.inquiry.findMany({
                where: isAdmin ? {} : { userId: dbUser.id },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            }),
            prisma.comment.count({
                where: { userId: dbUser.id }
            }),
            prisma.comment.findMany({
                where: { userId: dbUser.id },
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
        { label: 'Membership', value: dbUser.membership, icon: <Crown size={20} /> },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>User Dashboard</h1>
                    <p className={styles.subtitle}>Welcome back, {dbUser.name || 'User'}</p>
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
                        <ProfileEditor user={dbUser} />

                        {/* IoT Devices Section (New) */}
                        <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Cpu size={18} /> IoT Devices
                                </h4>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                                    <Plus size={18} />
                                </button>
                            </div>

                            {dbUser.devices.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>No devices connected.</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.2rem' }}>Upgrade to BASIC to add devices</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {dbUser.devices.map((device: any) => (
                                        <div key={device.id} style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{device.name}</p>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>{device.type}</p>
                                            </div>
                                            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: device.status === 'ONLINE' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: device.status === 'ONLINE' ? '#22c55e' : '#ef4444' }}>
                                                {device.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

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
