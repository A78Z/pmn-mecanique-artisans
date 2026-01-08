"use client";

/**
 * Super Admin Login Page
 * Premium institutional design with PMN branding
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Loader2, AlertCircle, LogIn, Shield, Eye, EyeOff } from 'lucide-react';
import { loginSuperAdmin } from '@/actions/authActions';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.replace('/admin-mecanique');
        }
    }, [isAuthenticated, authLoading, router]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await loginSuperAdmin(email.trim(), password);

            if (result.success && result.user) {
                // Store session and redirect
                login(
                    { id: result.user.id, email: result.user.email, role: result.user.role },
                    result.user.sessionToken
                );
                router.replace('/admin-mecanique');
            } else {
                setError(result.error || 'Erreur de connexion');
                if (result.remainingAttempts !== undefined) {
                    setRemainingAttempts(result.remainingAttempts);
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    // Email validation
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isFormValid = email.trim() && password && isValidEmail(email);

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50 p-4">
            {/* Login Card */}
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="relative w-32 h-20 mx-auto mb-4">
                        <Image
                            src="/images/logo-pmn.png"
                            alt="Logo PMN"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-700" />
                        <h1 className="text-xl font-bold text-gray-900">
                            Espace Super Administrateur
                        </h1>
                    </div>
                    <p className="text-sm text-gray-600">
                        Administration – Métiers Mécaniques
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="login-error">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                    {remainingAttempts !== null && remainingAttempts > 0 && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {remainingAttempts} tentative(s) restante(s)
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="login-input"
                                    disabled={isLoading}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="login-input pr-12"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    required
                                />
                                {/* Toggle password visibility */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-green-600"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="login-button"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Connexion en cours...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Se connecter</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-xs text-center text-gray-500">
                            🔒 Connexion sécurisée • Accès réservé aux administrateurs autorisés
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    © {new Date().getFullYear()} Projet Mobilier National
                </p>
            </div>
        </div>
    );
}
