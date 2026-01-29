'use client';

import { signOut } from "next-auth/react";
import styles from './profile.module.css';
import { LogOut } from 'lucide-react';

const getAppUrl = () => {
    if (typeof window === 'undefined') return '/';
    const hostname = window.location.hostname;
    if (hostname.includes('janghanju-server.duckdns.org')) {
        return 'https://janghanju-server.duckdns.org';
    }
    return window.location.origin;
};

const handleLogout = async () => {
    // Sign out without automatic redirect
    await signOut({ redirect: false });
    // Manually redirect to correct URL
    window.location.href = getAppUrl();
};

export function SignOutButton() {
    return (
        <button
            className={styles.logoutBtn}
            onClick={handleLogout}
        >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogOut size={18} />
                Sign Out
            </span>
        </button>
    );
}
