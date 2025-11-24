import { useTranslations } from 'next-intl';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MotionContainer } from "@/components/ui/motion-container";
import { MotionCard } from "@/components/ui/motion-card";
import { Mail, Phone, Github, Linkedin, MapPin, MessageCircle } from 'lucide-react';
import styles from './Contact.module.css';
import Link from 'next/link';

export default function Contact() {
    const t = useTranslations('Contact');

    const contacts = [
        { icon: <Mail size={24} />, label: t('email'), value: 'hanju1215@naver.com', href: 'mailto:hanju1215@naver.com' },
        { icon: <Phone size={24} />, label: t('phone'), value: '+82-10-9124-4770', href: 'tel:+821091244770' },
        { icon: <Github size={24} />, label: t('github'), value: 'github.com/janghanju', href: 'https://github.com/janghanju' },
        { icon: <Linkedin size={24} />, label: t('linkedin'), value: 'linkedin.com/in/janghanju', href: 'https://linkedin.com/in/janghanju' },
        { icon: <MapPin size={24} />, label: t('address'), value: t('addressValue'), href: null }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <main className={styles.main}>
                <MotionContainer>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{t('title')}</h1>
                        <p className={styles.subtitle}>{t('subtitle')}</p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.infoColumn}>
                            {contacts.map((contact, index) => (
                                <MotionCard key={index}>
                                    <div className={styles.contactCard}>
                                        <div className={styles.iconBox}>
                                            {contact.icon}
                                        </div>
                                        <div className={styles.contactInfo}>
                                            <span className={styles.label}>{contact.label}</span>
                                            {contact.href ? (
                                                <a href={contact.href} target="_blank" rel="noopener noreferrer" className={styles.valueLink}>
                                                    {contact.value}
                                                </a>
                                            ) : (
                                                <span className={styles.value}>{contact.value}</span>
                                            )}
                                        </div>
                                    </div>
                                </MotionCard>
                            ))}
                        </div>

                        <div className={styles.actionColumn}>
                            <MotionCard className={styles.fullHeight}>
                                <div className={styles.inquiryBox}>
                                    <div className={styles.inquiryIcon}>
                                        <MessageCircle size={48} color="white" />
                                    </div>
                                    <h2>{t('inquiryTitle')}</h2>
                                    <p>
                                        {t('inquiryDescription')}<br />
                                    </p>
                                    <Link href="/inquiry" className={styles.inquiryBtn}>
                                        {t('goToInquiry')}
                                    </Link>
                                </div>
                            </MotionCard>
                        </div>
                    </div>
                </MotionContainer>
            </main>
        </div>
    );
}
