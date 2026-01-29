'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, X, Globe, LogOut, User, MessageSquare, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession, signOut } from "next-auth/react";

const getAppUrl = () => {
    if (typeof window === 'undefined') return '/';
    // In production, use the actual hostname to construct the URL
    const hostname = window.location.hostname;
    if (hostname.includes('janghanju-server.duckdns.org')) {
        return 'https://janghanju-server.duckdns.org';
    }
    // For local development, use origin
    return window.location.origin;
};

const handleLogout = async () => {
    // Sign out without automatic redirect
    await signOut({ redirect: false });
    // Manually redirect to correct URL
    window.location.href = getAppUrl();
};

export function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notification count
    useEffect(() => {
        if (session?.user) {
            fetch('/api/notifications')
                .then(res => res.json())
                .then(data => setUnreadCount(data.unreadCount || 0))
                .catch(() => { });
        }
    }, [session]);
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('Navbar');

    const navItems = [
        { name: t('home'), href: '/' },
        { name: t('about'), href: '/about' },
        { name: t('services'), href: '/services' },
        { name: t('portfolio'), href: '/portfolio' },
        { name: t('news'), href: '/news' },
        { name: t('contact'), href: '/contact' },
    ];

    const toggleLocale = () => {
        const nextLocale = locale === 'en' ? 'ko' : 'en';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'rgba(3, 7, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--foreground)' }}>
                    One Week
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="hidden md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                color: pathname === item.href ? 'var(--primary)' : 'var(--muted-foreground)',
                                fontWeight: 500,
                                fontSize: '0.9rem'
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.5rem' }} />

                    <button onClick={toggleLocale} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', display: 'flex', alignItems: 'center' }}>
                        <Globe size={18} />
                    </button>

                    {session ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link
                                href="/inquiry"
                                style={{
                                    color: 'var(--muted-foreground)',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                }}
                            >
                                <MessageSquare size={16} /> Inquiry
                            </Link>
                            {/* Notification Bell */}
                            <Link
                                href="/profile"
                                style={{
                                    padding: '0.5rem',
                                    color: 'var(--muted-foreground)',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Notifications"
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '0',
                                        background: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '16px',
                                        height: '16px',
                                        fontSize: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700
                                    }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                            <Link
                                href="/profile"
                                style={{
                                    padding: '0.4rem 1rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: 'var(--primary)',
                                    borderRadius: '999px',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Profile" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                                ) : (
                                    <User size={16} />
                                )}
                                {session.user?.name || 'Profile'}
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--muted-foreground)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.5rem'
                                }}
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            style={{
                                padding: '0.5rem 1.2rem',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '999px',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            {t('login')}
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ background: 'none', border: 'none', color: 'var(--foreground)' }}
                    className="md:hidden"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--background)',
                    borderBottom: '1px solid var(--border)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    zIndex: 49
                }} className="md:hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            style={{
                                color: pathname === item.href ? 'var(--primary)' : 'var(--foreground)',
                                fontWeight: 500
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div style={{ height: '1px', background: 'var(--border)' }} />
                    <button onClick={toggleLocale} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={18} /> {locale === 'en' ? '한국어' : 'English'}
                    </button>
                    {session ? (
                        <>
                            <Link href="/inquiry" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageSquare size={18} /> 1:1 Inquiry
                            </Link>
                            <Link href="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} /> Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            {t('login')}
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
