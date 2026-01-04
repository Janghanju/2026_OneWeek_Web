import { useTranslations } from 'next-intl';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MotionContainer } from "@/components/ui/motion-container";
import { MotionCard } from "@/components/ui/motion-card";
import { Code2, Cpu, Globe, Rocket, User, Briefcase, GraduationCap } from 'lucide-react';
import styles from './about.module.css';

export default function About() {
    const t = useTranslations('About');

    const skills = [
        { name: "Next.js / React", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Node.js", level: 80 },
        { name: "Embedded C/C++", level: 95 },
        { name: "RTOS (FreeRTOS)", level: 85 },
        { name: "PCB Design", level: 75 }
    ];

    const experiences = [
        {
            title: t('job1Title'),
            company: t('job1Company'),
            period: "2020 - Present",
            desc: "Leading the firmware development team for IoT smart home devices."
        },
        {
            title: t('job2Title'),
            company: t('job2Company'),
            period: "2018 - 2020",
            desc: "Developed low-power sensor nodes and implemented mesh networking protocols."
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
