import { useTranslations } from 'next-intl';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MotionContainer } from "@/components/ui/motion-container";
import { MotionCard } from "@/components/ui/motion-card";
import { Code2, Cpu, User, Briefcase, Github } from 'lucide-react';
import styles from './about.module.css';
import { Link } from '@/i18n/routing';

export default function About() {
    const t = useTranslations('About');

    const skills = [
        { name: "Arduino / ESP32", level: 95, category: "embedded" },
        { name: "3D Printing / CAD", level: 85, category: "hardware" },
        { name: "Next.js / React", level: 85, category: "web" },
        { name: "TypeScript", level: 80, category: "web" },
        { name: "Flutter / Dart", level: 75, category: "mobile" },
        { name: "Python", level: 85, category: "backend" },
        { name: "Node.js", level: 80, category: "backend" },
        { name: "Docker / CI/CD", level: 70, category: "devops" }
    ];

    const experiences = [
        {
            title: t('job1Title'),
            company: t('job1Company'),
            period: t('job1Period'),
            desc: t('job1Desc')
        },
        {
            title: t('job2Title'),
            company: t('job2Company'),
            period: t('job2Period'),
            desc: t('job2Desc')
        }
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
                        <MotionCard>
                            <div className={styles.cardContent}>
                                <div className={styles.iconBox}>
                                    <User size={32} color="var(--primary)" />
                                </div>
                                <h2>{t('introTitle')}</h2>
                                <p>{t('intro')}</p>
                                <a
                                    href="https://github.com/Janghanju"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginTop: '1.5rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                >
                                    <Github size={20} />
                                    {t('githubLink')}
                                </a>
                            </div>
                        </MotionCard>

                        <MotionCard>
                            <div className={styles.cardContent}>
                                <div className={styles.iconBox}>
                                    <Code2 size={32} color="var(--accent)" />
                                </div>
                                <h2>{t('skills')}</h2>
                                <div className={styles.skillsList}>
                                    {skills.map(skill => (
                                        <div key={skill.name} className={styles.skillItem}>
                                            <div className={styles.skillInfo}>
                                                <span>{skill.name}</span>
                                                <span>{skill.level}%</span>
                                            </div>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={styles.progressFill}
                                                    style={{ width: `${skill.level}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </MotionCard>

                        <MotionCard className={styles.fullWidth}>
                            <div className={styles.cardContent}>
                                <div className={styles.iconBox}>
                                    <Briefcase size={32} color="#10b981" />
                                </div>
                                <h2>{t('experience')}</h2>
                                <div className={styles.timeline}>
                                    {experiences.map((exp, index) => (
                                        <div key={index} className={styles.timelineItem}>
                                            <div className={styles.timelineDot} />
                                            <div className={styles.timelineContent}>
                                                <h3>{exp.title}</h3>
                                                <span className={styles.company}>{exp.company}</span>
                                                <span className={styles.period}>{exp.period}</span>
                                                <p>{exp.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </MotionCard>
                    </div>
                </MotionContainer>
            </main>
        </div>
    );
}
