'use client';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useTranslations } from 'next-intl';
import { Mail, Phone, Github, Linkedin } from "lucide-react";
import styles from './Contact.module.css';

export default function ContactPage() {
    const t = useTranslations('contact');

    const contacts = [
        { icon: <Mail size={40} />, label: t('email'), value: 'hanju@example.com' },
        { icon: <Phone size={40} />, label: t('phone'), value: '+82-10-1234-5678' },
        { icon: <Github size={40} />, label: t('github'), value: 'github.com/hanju' },
        { icon: <Linkedin size={40} />, label: t('linkedin'), value: 'linkedin.com/in/hanju' }
    ];

    return (
        <div className={styles.container}>
            <AnimatedBackground />
            <Navbar />
            <main className={styles.main}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                <div className={styles.card}>
                    <p className={styles.bio}>{t('bio')}</p>
                    <ul className={styles.list}>
                        {contacts.map((c, i) => (
                            <li key={i} className={styles.item}>
                                {c.icon}
                                <span className={styles.label}>{c.label}:</span>
                                <span className={styles.value}>{c.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
