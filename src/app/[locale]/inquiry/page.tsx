'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MotionContainer } from "@/components/ui/motion-container";
import { MotionCard } from "@/components/ui/motion-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Inquiry {
    id: string;
    title: string;
    content: string;
    answer?: string;
    createdAt: string;
    isPrivate: boolean;
}

export default function InquiryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchInquiries();
        }
    }, [status, router]);

    const fetchInquiries = async () => {
        const res = await fetch("/api/inquiry");
        if (res.ok) {
            const data = await res.json();
            setInquiries(data.inquiries || []);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, isPrivate: true })
            });
            if (res.ok) {
                setTitle("");
                setContent("");
                fetchInquiries();
                alert("문의가 등록되었습니다.");
            } else {
                alert("등록 실패");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return <div>Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>1:1 문의</h1>

                <MotionContainer>
                    <MotionCard>
                        <div style={{ padding: '2rem', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>문의하기</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="제목"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                />
                                <textarea
                                    placeholder="문의 내용"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    required
                                    rows={5}
                                    style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {loading ? "등록 중..." : "문의 등록"}
                                </button>
                            </form>
                        </div>
                    </MotionCard>

                    <div style={{ marginTop: '3rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>나의 문의 내역</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {inquiries.length === 0 ? (
                                <p style={{ color: 'var(--muted-foreground)', textAlign: 'center' }}>문의 내역이 없습니다.</p>
                            ) : (
                                inquiries.map(inquiry => (
                                    <MotionCard key={inquiry.id}>
                                        <div style={{ padding: '1.5rem', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontWeight: 700 }}>{inquiry.title}</h3>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>{inquiry.content}</p>

                                            {inquiry.answer ? (
                                                <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '1rem', borderRadius: 'var(--radius)', marginTop: '1rem' }}>
                                                    <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>답변</div>
                                                    <p>{inquiry.answer}</p>
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontStyle: 'italic' }}>답변 대기 중...</div>
                                            )}
                                        </div>
                                    </MotionCard>
                                ))
                            )}
                        </div>
                    </div>
                </MotionContainer>
            </main>
        </div>
    );
}
