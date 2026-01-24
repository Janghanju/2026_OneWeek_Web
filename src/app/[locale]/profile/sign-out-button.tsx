'use client';

import { signOut } from "next-auth/react";
import styles from './profile.module.css';
import { LogOut } from 'lucide-react';

const getAppUrl = () => process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export function SignOutButton() {
    return (
        <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: getAppUrl() })}
        >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogOut size={18} />
                Sign Out
            </span>
        </button>
    );
}

