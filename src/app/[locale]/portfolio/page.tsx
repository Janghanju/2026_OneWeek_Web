import { Navbar } from "@/components/navbar";
import { useTranslations } from 'next-intl';
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

export default function PortfolioPage() {
    const t = useTranslations('Portfolio');

    const projects = [
        {
            title: "Re:Zero Web",
            desc: "Next.js 14 Portfolio & News Aggregator",
            tags: ["Next.js", "TypeScript", "NextAuth", "i18n"],
            link: "#",
            github: "#"
        },
        {
            title: "AI Chat Agent",
            desc: "Conversational AI interface with RAG support",
            tags: ["React", "Python", "LangChain", "OpenAI"],
            link: "#",
            github: "#"
        },
        {
            title: "E-Commerce Dashboard",
            desc: "Admin panel for managing products and orders",
            tags: ["Vue.js", "Firebase", "Tailwind"],
            link: "#",
            github: "#"
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
            <Navbar />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, var(--primary), var(--accent))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {t('title')}
                    </h1>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '1.2rem' }}>
                        {t('desc')}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem'
                }}>
                    {projects.map((project, index) => (
                        <div key={index} style={{
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{
                                height: '200px',
                                background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#555'
                            }}>
                                Project Preview Image
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.title}</h3>
                                <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', flex: 1 }}>{project.desc}</p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {project.tags.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: '0.8rem',
                                            padding: '0.2rem 0.6rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '99px',
                                            color: 'var(--foreground)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Link href={project.link} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        color: 'var(--primary)', fontWeight: 600, textDecoration: 'none'
                                    }}>
                                        <ExternalLink size={16} /> Live Demo
                                    </Link>
                                    <Link href={project.github} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        color: 'var(--muted-foreground)', fontWeight: 600, textDecoration: 'none'
                                    }}>
                                        <Github size={16} /> Code
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
