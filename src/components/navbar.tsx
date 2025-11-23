'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('Navbar');

    const navItems = [
        { name: t('home'), href: '/' },
        { name: t('services'), href: '/services' },
        { name: t('portfolio'), href: '/portfolio' },
        { name: t('news'), href: '/news' },
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
                    Re:Zero
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                color: pathname === item.href ? 'var(--primary)' : 'var(--muted-foreground)',
                                fontWeight: 500,
                                fontSize: '0.95rem'
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <button onClick={toggleLocale} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}>
                        <Globe size={20} />
                    </button>

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
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ display: 'none', background: 'none', border: 'none', color: 'var(--foreground)' }}
                    className="md:hidden"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>
        </nav>
    );
}
