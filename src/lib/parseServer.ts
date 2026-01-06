import Parse from 'parse/node';

let isInitialized = false;

export function initializeParseServer() {
    if (isInitialized) return;

    const appId = process.env.NEXT_PUBLIC_PARSE_APP_ID;
    const jsKey = process.env.NEXT_PUBLIC_PARSE_JS_KEY;
    const serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL;

    if (!appId || !jsKey || !serverURL) {
        console.error('Parse credentials not found in environment variables');
        return;
    }

    Parse.initialize(appId, jsKey);
    (Parse as any).serverURL = serverURL;

    // Explicitly set masterKey if available for server operations, though JS key is often enough for public/protected depending on ACL
    // But for admin dashboard, might need master key if we want to bypass ACLs? 
    // For now stick to JS Key as per existing implementation.

    isInitialized = true;
    console.log('Parse Server initialized');
}

// Initialize immediately when imported
initializeParseServer();

export default Parse;
