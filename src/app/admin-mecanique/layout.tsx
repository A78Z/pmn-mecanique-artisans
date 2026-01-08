"use client";

/**
 * Admin Mécanique Layout
 * Provides authentication protection for all admin routes
 */

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// ═══════════════════════════════════════════════════════════════
// AUTH GUARD COMPONENT
// ═══════════════════════════════════════════════════════════════

function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading, user } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    // Login page doesn't need protection
    const isLoginPage = pathname === '/admin-mecanique/login';

    useEffect(() => {
        // Skip check for login page
        if (isLoginPage) {
            setIsChecking(false);
            return;
        }

        // Wait for auth check to complete
        if (isLoading) {
            return;
        }

        // Not authenticated - redirect to login
        if (!isAuthenticated) {
            router.replace('/admin-mecanique/login');
            return;
        }

        // Authenticated but not superAdmin - access denied
        if (user && user.role !== 'superAdmin') {
            // Could redirect to an access denied page
            console.error('Access denied: User is not a Super Admin');
            router.replace('/admin-mecanique/login');
            return;
        }

        // All checks passed
        setIsChecking(false);
    }, [isAuthenticated, isLoading, isLoginPage, router, user]);

    // Login page - no guard needed
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Still checking auth
    if (isLoading || isChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                <p className="text-gray-600 text-sm">Vérification de l'authentification...</p>
            </div>
        );
    }

    // Not authenticated (will redirect)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50">
                <ShieldAlert className="w-10 h-10 text-yellow-600 mb-4" />
                <p className="text-gray-600 text-sm">Redirection vers la page de connexion...</p>
            </div>
        );
    }

    // Authenticated - show content
    return <>{children}</>;
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════════

export default function AdminMecaniqueLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <AuthGuard>
                {children}
            </AuthGuard>
        </AuthProvider>
    );
}
