'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Edit2, Save, X, Camera, Shield, Crown, Zap, Star, Gem } from 'lucide-react';
import styles from './profile.module.css';
import { SignOutButton } from './sign-out-button';

interface ProfileEditorProps {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
        membership?: string;
    };
}

export function ProfileEditor({ user }: ProfileEditorProps) {
    const { update } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [image, setImage] = useState(user.image || '');
    const [loading, setLoading] = useState(false);

    // Master Admin Logic
    const isMaster = user.email === 'hanju1215@naver.com';
    const [targetEmail, setTargetEmail] = useState('');
    const [targetMembership, setTargetMembership] = useState('FREE');

    const membershipIcons: Record<string, React.ReactNode> = {
        'FREE': <Zap size={14} />,
        'BASIC': <Star size={14} />,
        'PREMIUM': <Crown size={14} />,
        'MASTER': <Gem size={14} />,
    };

    const membershipColors: Record<string, string> = {
        'FREE': 'var(--muted-foreground)',
        'BASIC': '#3b82f6',
        'PREMIUM': '#8b5cf6',
        'MASTER': '#f59e0b',
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image }),
            });

            if (!res.ok) throw new Error('Failed to update');

            await update({ name, image }); // Update session
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (action: 'promote' | 'membership') => {
        if (!targetEmail) return;
        try {
            const endpoint = action === 'promote' ? '/api/admin/promote' : '/api/admin/membership';
            const body = action === 'promote' ? { email: targetEmail } : { email: targetEmail, membership: targetMembership };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                alert(`Successfully updated ${targetEmail}`);
                setTargetEmail('');
            } else {
                alert('Failed to update user');
            }
        } catch (e) {
            alert('Error updating user');
        }
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                    {image ? (
                        <img src={image} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                            <User size={40} />
                        </div>
                    )}
                </div>
                {isEditing && (
                    <div className={styles.avatarOverlay}>
                        <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                            <Camera size={24} color="white" />
                        </label>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Display Name</label>
                        <input
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Display Name"
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Avatar URL</label>
                        <input
                            className={styles.input}
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button onClick={handleSave} disabled={loading} className={styles.saveBtn}>
                            <Save size={16} /> Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                            <X size={16} /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h2 className={styles.name}>{name}</h2>
                    <p className={styles.email}>{user.email}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <span className={styles.roleBadge} style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                        }}>
                            {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                            {user.role || 'USER'}
                        </span>

                        <span className={styles.roleBadge} style={{
                            background: `${membershipColors[user.membership || 'FREE']}20`,
                            color: membershipColors[user.membership || 'FREE'],
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            border: `1px solid ${membershipColors[user.membership || 'FREE']}40`
                        }}>
                            {membershipIcons[user.membership || 'FREE']}
                            {user.membership || 'FREE'} Tier
                        </span>
                    </div>

                    <button onClick={() => setIsEditing(true)} className={styles.editBtn} style={{ marginTop: '1rem' }}>
                        <Edit2 size={14} /> Edit Profile
                    </button>
                </>
            )}

            <div style={{ marginTop: '2rem', width: '100%', position: 'relative', zIndex: 10 }}>
                <SignOutButton />
            </div>

            {isMaster && (
                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', width: '100%', position: 'relative', zIndex: 10 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={14} color="var(--primary)" /> Master Admin Area
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                            className={styles.input}
                            placeholder="User Email"
                            value={targetEmail}
                            onChange={e => setTargetEmail(e.target.value)}
                            style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                className={styles.input}
                                value={targetMembership}
                                onChange={e => setTargetMembership(e.target.value)}
                                style={{ fontSize: '0.8rem', padding: '0.5rem', flex: 1 }}
                            >
                                <option value="FREE">FREE</option>
                                <option value="BASIC">BASIC</option>
                                <option value="PREMIUM">PREMIUM</option>
                                <option value="MASTER">MASTER</option>
                            </select>
                            <button onClick={() => handleUpdateUser('membership')} className={styles.saveBtn} style={{ padding: '0.5rem', flex: 1 }}>
                                Set Tier
                            </button>
                            <button onClick={() => handleUpdateUser('promote')} className={styles.saveBtn} style={{ padding: '0.5rem', flex: 1, background: '#10b981' }}>
                                Promote
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
