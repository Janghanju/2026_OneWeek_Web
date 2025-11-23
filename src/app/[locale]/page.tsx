import { Navbar } from "@/components/navbar";
import styles from "./home.module.css";
import { ArrowRight, Code, Globe, Zap, Newspaper, CheckCircle } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Zap size={16} className={styles.badgeIcon} />
            <span>Available for new projects</span>
          </div>
          <h1 className={styles.title}>
            {t('heroTitle')}
          </h1>
          <p className={styles.subtitle}>
            {t('heroSubtitle')}
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/portfolio" className={styles.primaryBtn}>
              {t('getStarted')} <ArrowRight size={18} />
            </Link>
            <Link href="/portfolio" className={styles.secondaryBtn}>
              {t('viewPortfolio')}
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.glow} />
          <div className={styles.grid} />
        </div>
      </section>

      {/* Services Preview */}
      <section className={styles.services}>
        <h2 className={styles.sectionTitle}>{t('servicesTitle')}</h2>
        <div className={styles.serviceGrid}>
          <div className={styles.serviceCard}>
            <Globe size={32} className={styles.serviceIcon} />
            <h3>Web Development</h3>
            <p>High-performance, responsive websites built with Next.js.</p>
          </div>
          <div className={styles.serviceCard}>
            <Code size={32} className={styles.serviceIcon} />
            <h3>App Development</h3>
            <p>Cross-platform mobile apps using React Native.</p>
          </div>
          <div className={styles.serviceCard}>
            <CheckCircle size={32} className={styles.serviceIcon} />
            <h3>Tech Consulting</h3>
            <p>Expert advice on your tech stack and architecture.</p>
          </div>
        </div>
      </section>

      {/* News CTA */}
      <section className={styles.newsCta}>
        <div className={styles.newsContent}>
          <Newspaper size={48} className={styles.newsIcon} />
          <h2>{t('newsTitle')}</h2>
          <p>Stay updated with the latest trends in development and startups.</p>
          <Link href="/news" className={styles.newsBtn}>
            Read News
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 Re:Zero. All rights reserved.</p>
      </footer>
    </div>
  );
}
