"use server";

/**
 * Server Actions for Super Admin Authentication
 * Uses Parse SDK to authenticate with Back4App
 */

import Parse from '@/lib/parseServer';

// Rate limiting: track failed attempts (simple in-memory, resets on server restart)
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// ═══════════════════════════════════════════════════════════════
// LOGIN - Authenticate Super Admin
// ═══════════════════════════════════════════════════════════════

export interface LoginResult {
    success: boolean;
    user?: {
        id: string;
        email: string;
        role: string;
        sessionToken: string;
    };
    error?: string;
    remainingAttempts?: number;
}

export async function loginSuperAdmin(email: string, password: string): Promise<LoginResult> {
    try {
        // Validate inputs
        if (!email || !password) {
            return { success: false, error: "Email et mot de passe requis" };
        }

        // Check rate limiting
        const clientKey = email.toLowerCase();
        const attempts = failedAttempts.get(clientKey);

        if (attempts) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

            if (attempts.count >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_DURATION) {
                const remainingLockout = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
                return {
                    success: false,
                    error: `Trop de tentatives échouées. Réessayez dans ${remainingLockout} minute(s).`,
                    remainingAttempts: 0
                };
            }

            // Reset if lockout expired
            if (timeSinceLastAttempt >= LOCKOUT_DURATION) {
                failedAttempts.delete(clientKey);
            }
        }

        // Attempt login with Parse
        const user = await Parse.User.logIn(email, password);

        if (!user) {
            recordFailedAttempt(clientKey);
            return {
                success: false,
                error: "Identifiants invalides",
                remainingAttempts: getRemainingAttempts(clientKey)
            };
        }

        // Verify superAdmin role
        const role = user.get('role');
        if (role !== 'superAdmin') {
            // Logout the user since they don't have permission
            await Parse.User.logOut();
            console.warn(`Non-admin user attempted access: ${email}`);
            return {
                success: false,
                error: "Accès non autorisé. Réservé aux Super Administrateurs."
            };
        }

        // Clear failed attempts on success
        failedAttempts.delete(clientKey);

        // Get session token
        const sessionToken = user.getSessionToken();

        console.log(`Super Admin login successful: ${email}`);

        return {
            success: true,
            user: {
                id: user.id || '',
                email: user.get('email') || email,
                role: role,
                sessionToken: sessionToken || ''
            }
        };

    } catch (error: any) {
        // Detailed logging for debugging (never log password)
        console.error('Login error details:', {
            code: error.code,
            message: error.message,
            email: email, // Safe to log
            timestamp: new Date().toISOString()
        });

        // Record failed attempt
        const clientKey = email.toLowerCase();
        recordFailedAttempt(clientKey);

        // Parse specific error codes
        // 101 = Invalid username/password
        // 200 = Username missing
        // 201 = Password missing  
        // 205 = Email not verified (if configured)
        // 209 = Invalid session token
        if (error.code === 101) {
            return {
                success: false,
                error: "Email ou mot de passe incorrect",
                remainingAttempts: getRemainingAttempts(clientKey)
            };
        }

        if (error.code === 205) {
            return {
                success: false,
                error: "Veuillez vérifier votre adresse email avant de vous connecter."
            };
        }

        if (error.code === 209) {
            return {
                success: false,
                error: "Session invalide. Veuillez réessayer."
            };
        }

        // Network or connection errors
        if (error.message && error.message.includes('network')) {
            return {
                success: false,
                error: "Erreur réseau. Vérifiez votre connexion internet."
            };
        }

        // Generic fallback (don't expose internal details)
        return {
            success: false,
            error: "Erreur de connexion. Veuillez réessayer."
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// VALIDATE SESSION - Check if session token is valid
// ═══════════════════════════════════════════════════════════════

export interface SessionResult {
    valid: boolean;
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export async function validateSession(sessionToken: string): Promise<SessionResult> {
    try {
        if (!sessionToken) {
            return { valid: false };
        }

        // Use the session token to become the user
        const user = await Parse.User.become(sessionToken);

        if (!user) {
            return { valid: false };
        }

        // Verify role
        const role = user.get('role');
        if (role !== 'superAdmin') {
            return { valid: false };
        }

        return {
            valid: true,
            user: {
                id: user.id || '',
                email: user.get('email') || '',
                role: role
            }
        };

    } catch (error) {
        console.error('Session validation error:', error);
        return { valid: false };
    }
}

// ═══════════════════════════════════════════════════════════════
// LOGOUT - Clear session
// ═══════════════════════════════════════════════════════════════

export async function logoutUser(): Promise<{ success: boolean }> {
    try {
        await Parse.User.logOut();
        console.log('User logged out successfully');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        // Even if server logout fails, we return success
        // Client will clear local storage anyway
        return { success: true };
    }
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function recordFailedAttempt(clientKey: string): void {
    const current = failedAttempts.get(clientKey) || { count: 0, lastAttempt: 0 };
    failedAttempts.set(clientKey, {
        count: current.count + 1,
        lastAttempt: Date.now()
    });
}

function getRemainingAttempts(clientKey: string): number {
    const attempts = failedAttempts.get(clientKey);
    if (!attempts) return MAX_ATTEMPTS;
    return Math.max(0, MAX_ATTEMPTS - attempts.count);
}
