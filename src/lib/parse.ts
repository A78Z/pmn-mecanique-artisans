/**
 * Parse SDK Initialization for Back4App
 * 
 * This file initializes the Parse SDK with Back4App credentials.
 * Used by both client and server components.
 */

import Parse from 'parse';

// Check if we're in the browser or server
const isBrowser = typeof window !== 'undefined';

// Initialize Parse only once
let isInitialized = false;

export function initializeParse() {
    if (isInitialized) return;

    // Only initialize in browser environment to avoid localStorage errors
    if (!isBrowser) return;

    const appId = process.env.NEXT_PUBLIC_PARSE_APP_ID;
    const jsKey = process.env.NEXT_PUBLIC_PARSE_JS_KEY;
    const serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL;

    if (!appId || !jsKey || !serverURL) {
        console.error('Parse credentials not found in environment variables');
        return;
    }

    try {
        Parse.initialize(appId, jsKey);
        (Parse as any).serverURL = serverURL;
        isInitialized = true;
        console.log('Parse initialized successfully');
    } catch (error) {
        console.error('Parse initialization failed:', error);
    }
}

// Auto-initialize on import only in browser
if (typeof window !== 'undefined') {
    initializeParse();
}

// Export the configured Parse instance
export default Parse;

// Export types for Artisan from shared types to maintain backward compatibility if needed
export type { ArtisanData } from '@/types/artisan';

