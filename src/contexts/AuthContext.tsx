"use client";

/**
 * Authentication Context for Super Admin
 * Manages session state and provides auth methods across the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { validateSession, logoutUser } from '@/actions/authActions';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (user: AuthUser, sessionToken: string) => void;
    logout: () => Promise<void>;
    checkSession: () => Promise<boolean>;
}

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY_USER = 'pmn_admin_user';
const STORAGE_KEY_TOKEN = 'pmn_admin_token';

// ═══════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check session on mount
    useEffect(() => {
        checkSession();
    }, []);

    // Check if current session is valid
    const checkSession = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);

        try {
            // Get stored session token
            const storedToken = typeof window !== 'undefined'
                ? localStorage.getItem(STORAGE_KEY_TOKEN)
                : null;

            if (!storedToken) {
                setUser(null);
                setIsLoading(false);
                return false;
            }

            // Validate with server
            const result = await validateSession(storedToken);

            if (result.valid && result.user) {
                setUser(result.user);
                setIsLoading(false);
                return true;
            } else {
                // Clear invalid session
                clearStorage();
                setUser(null);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error('Session check error:', error);
            clearStorage();
            setUser(null);
            setIsLoading(false);
            return false;
        }
    }, []);

    // Login - Store user and token
    const login = useCallback((userData: AuthUser, sessionToken: string) => {
        setUser(userData);

        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
            localStorage.setItem(STORAGE_KEY_TOKEN, sessionToken);
        }
    }, []);

    // Logout - Clear session
    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            clearStorage();
        }
    }, []);

    // Helper to clear storage
    const clearStorage = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY_USER);
            localStorage.removeItem(STORAGE_KEY_TOKEN);
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
