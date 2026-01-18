"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import styles from "./home.module.css";
import { ArrowRight, Code, Globe, Zap, Newspaper, CheckCircle, Brain, Cloud, GitBranch, Shield, Database, Loader2 } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function Home() {
  const t = useTranslations('Home');
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  const services = [
    { icon: <Globe size={32} className={styles.serviceIcon} />, title: t('webDevelopment'), desc: t('webDevelopmentDesc') },
    { icon: <Code size={32} className={styles.serviceIcon} />, title: t('appDevelopment'), desc: t('appDevelopmentDesc') },
    { icon: <CheckCircle size={32} className={styles.serviceIcon} />, title: t('techConsulting'), desc: t('techConsultingDesc') },
    { icon: <Brain size={32} className={styles.serviceIcon} />, title: t('aiMlSolutions'), desc: t('aiMlSolutionsDesc') },
    { icon: <Cloud size={32} className={styles.serviceIcon} />, title: t('cloudInfrastructure'), desc: t('cloudInfrastructureDesc') },
    { icon: <GitBranch size={32} className={styles.serviceIcon} />, title: t('devOpsCiCd'), desc: t('devOpsCiCdDesc') },
    { icon: <Shield size={32} className={styles.serviceIcon} />, title: t('cybersecurity'), desc: t('cybersecurityDesc') },
    { icon: <Database size={32} className={styles.serviceIcon} />, title: t('dataEngineering'), desc: t('dataEngineeringDesc') },
    { icon: <Zap size={32} className={styles.serviceIcon} />, title: t('blockchainDevelopment'), desc: t('blockchainDevelopmentDesc') },
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
            <span>{t('availableForProjects')}</span>
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
          <div className={styles.splineWrapper}>
            {!isSplineLoaded && (
              <div className={styles.splineLoader}>
                <Loader2 className={styles.spinner} size={48} />
              </div>
            )}
            <Spline
              scene="https://prod.spline.design/4I4wQYzT2e23xPiF/scene.splinecode"
              onLoad={() => setIsSplineLoaded(true)}
            />
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className={styles.services}>
        <h2 className={styles.sectionTitle}>{t('servicesTitle')}</h2>
        <div className={styles.serviceGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              {service.icon}
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News CTA */}
      <section className={styles.newsCta}>
        <div className={styles.newsContent}>
          <Newspaper size={48} className={styles.newsIcon} />
          <h2>{t('newsTitle')}</h2>
          <p>{t('stayUpdated')}</p>
          <Link href="/news" className={styles.newsBtn}>
            {t('readNews')}
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 One Week. {t('allRightsReserved')}.</p>
      </footer>
    </div>
  );
}
