'use client';

import { signOut } from "next-auth/react";
import styles from './profile.module.css';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
    return (
        <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: window.location.origin })}
        >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogOut size={18} />
                Sign Out
            </span>
        </button>
    );
}
