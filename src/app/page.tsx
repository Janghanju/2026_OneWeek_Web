import Link from "next/link";
import styles from "./home.module.css";
import { ArrowRight, Code, Globe, Rocket, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Build Your Digital Empire <br />
          <span style={{ color: 'var(--primary)' }}>With Precision.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Premium web development services and real-time tech insights.
          We transform ideas into scalable, high-performance applications.
        </p>
        <div className={styles.heroCta}>
          <Link href="/services" className={styles.primaryBtn}>
            Start Project <ArrowRight size={20} />
          </Link>
          <Link href="/portfolio" className={styles.secondaryBtn}>
            View Work
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Expertise</h2>
        <p className={styles.sectionDesc}>
          Delivering enterprise-grade solutions with modern technologies.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}><Globe /></div>
            <h3 className={styles.cardTitle}>Web Development</h3>
            <p className={styles.cardText}>
              Full-stack applications built with Next.js, React, and Node.js.
              SEO-optimized and performance-tuned.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}><ShieldCheck /></div>
            <h3 className={styles.cardTitle}>Secure Systems</h3>
            <p className={styles.cardText}>
              Enterprise security standards, authentication, and data protection
              baked into every project.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}><Code /></div>
            <h3 className={styles.cardTitle}>API Integration</h3>
            <p className={styles.cardText}>
              Seamless integration with third-party services, payment gateways,
              and AI models.
            </p>
          </div>
        </div>
      </section>

      {/* News Preview CTA */}
      <section className={styles.newsPreview}>
        <Rocket size={48} color="var(--accent)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 className={styles.sectionTitle}>Stay Ahead of the Curve</h2>
        <p className={styles.sectionDesc}>
          Get real-time updates on the latest tech trends, frameworks, and tools.
          Curated for developers, by developers.
        </p>
        <Link href="/news" className={styles.primaryBtn}>
          Explore Tech News
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2025 Re:Zero. All rights reserved.</p>
      </footer>
    </main>
  );
}
