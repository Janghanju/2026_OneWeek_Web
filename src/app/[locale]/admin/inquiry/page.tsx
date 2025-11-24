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
    user: {
        name: string | null;
        email: string;
    };
}

export default function AdminInquiryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [answeringId, setAnsweringId] = useState<string | null>(null);
    const [answerText, setAnswerText] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            if (session?.user?.role !== "ADMIN") {
                alert("관리자 권한이 필요합니다.");
                router.push("/");
            } else {
                fetchInquiries();
            }
        }
    }, [status, session, router]);

    const fetchInquiries = async () => {
        const res = await fetch("/api/admin/inquiry");
        if (res.ok) {
            const data = await res.json();
            setInquiries(data.inquiries || []);
        }
    };

    const handleAnswer = async (id: string) => {
        try {
            const res = await fetch("/api/admin/inquiry", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, answer: answerText })
            });
            if (res.ok) {
                alert("답변이 등록되었습니다.");
                setAnsweringId(null);
                setAnswerText("");
                fetchInquiries();
            } else {
                alert("답변 등록 실패");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (status === "loading") return <div>Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            <AnimatedBackground />
            <Navbar />

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 1 }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>관리자 문의 관리</h1>

                <MotionContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {inquiries.map(inquiry => (
                            <MotionCard key={inquiry.id}>
                                <div style={{ padding: '1.5rem', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{inquiry.title}</h3>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                                                작성자: {inquiry.user.name || inquiry.user.email} ({inquiry.user.email})
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                                            {new Date(inquiry.createdAt).toLocaleString()}
                                        </span>
                                    </div>

                                    <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                                        {inquiry.content}
                                    </div>

                                    {inquiry.answer ? (
                                        <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>답변 완료</div>
                                            <p>{inquiry.answer}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {answeringId === inquiry.id ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    <textarea
                                                        value={answerText}
                                                        onChange={e => setAnswerText(e.target.value)}
                                                        rows={4}
                                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                                                        placeholder="답변을 입력하세요..."
                                                    />
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => handleAnswer(inquiry.id)}
                                                            style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                                                        >
                                                            등록
                                                        </button>
                                                        <button
                                                            onClick={() => setAnsweringId(null)}
                                                            style={{ padding: '0.5rem 1rem', background: 'var(--muted)', color: 'var(--foreground)', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                                                        >
                                                            취소
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setAnsweringId(inquiry.id); setAnswerText(""); }}
                                                    style={{ padding: '0.5rem 1rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                                                >
                                                    답변하기
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </MotionCard>
                        ))}
                    </div>
                </MotionContainer>
            </main>
        </div>
    );
}
