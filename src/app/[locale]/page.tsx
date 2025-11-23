import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import styles from "./home.module.css";
import { ArrowRight, Code, Globe, Zap, Newspaper, CheckCircle, Brain, Cloud, GitBranch, Shield, Database } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { MotionCard } from "@/components/ui/motion-card";

export default function Home() {
  const t = useTranslations('Home');

  const services = [
    { icon: <Globe size={32} className={styles.serviceIcon} />, title: 'Web Development', desc: 'High-performance, responsive websites built with Next.js.' },
    { icon: <Code size={32} className={styles.serviceIcon} />, title: 'App Development', desc: 'Cross-platform mobile apps using React Native.' },
    { icon: <CheckCircle size={32} className={styles.serviceIcon} />, title: 'Tech Consulting', desc: 'Expert advice on your tech stack and architecture.' },
    { icon: <Brain size={32} className={styles.serviceIcon} />, title: 'AI/ML Solutions', desc: 'Intelligent systems powered by machine learning.' },
    { icon: <Cloud size={32} className={styles.serviceIcon} />, title: 'Cloud Infrastructure', desc: 'Scalable cloud solutions on AWS, Azure, and GCP.' },
    { icon: <GitBranch size={32} className={styles.serviceIcon} />, title: 'DevOps & CI/CD', desc: 'Automated deployment pipelines and infrastructure.' },
    { icon: <Shield size={32} className={styles.serviceIcon} />, title: 'Cybersecurity', desc: 'Secure your applications with modern security practices.' },
    { icon: <Database size={32} className={styles.serviceIcon} />, title: 'Data Engineering', desc: 'Build robust data pipelines and warehouses.' },
    { icon: <Zap size={32} className={styles.serviceIcon} />, title: 'Blockchain Development', desc: 'Smart contracts and decentralized applications.' },
  ];

  return (
    <div className={styles.container}>
      <AnimatedBackground />
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
          {services.map((service, index) => (
            <MotionCard key={index} index={index}>
              <div className={styles.serviceCard}>
                {service.icon}
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            </MotionCard>
          ))}
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
        <p>© 2026 One Week. All rights reserved.</p>
      </footer>
    </div>
  );
}
