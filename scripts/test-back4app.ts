/**
 * Back4App Connection Diagnostic Script
 * Run with: npx ts-node --esm scripts/test-back4app.ts
 * Or: node --loader ts-node/esm scripts/test-back4app.ts
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Dynamic import for Parse
const Parse = require('parse/node');

async function testBack4App() {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           BACK4APP CONNECTION DIAGNOSTIC                       ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // 1. Check environment variables
    console.log('📋 1. Checking environment variables...\n');

    const appId = process.env.NEXT_PUBLIC_PARSE_APP_ID;
    const jsKey = process.env.NEXT_PUBLIC_PARSE_JS_KEY;
    const serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL;

    console.log(`   NEXT_PUBLIC_PARSE_APP_ID: ${appId ? '✅ Set (' + appId.substring(0, 10) + '...)' : '❌ MISSING'}`);
    console.log(`   NEXT_PUBLIC_PARSE_JS_KEY: ${jsKey ? '✅ Set (' + jsKey.substring(0, 10) + '...)' : '❌ MISSING'}`);
    console.log(`   NEXT_PUBLIC_PARSE_SERVER_URL: ${serverURL ? '✅ Set (' + serverURL + ')' : '❌ MISSING'}`);

    if (!appId || !jsKey || !serverURL) {
        console.log('\n❌ ERROR: Missing environment variables. Cannot proceed.');
        console.log('   Make sure .env.local contains:');
        console.log('   NEXT_PUBLIC_PARSE_APP_ID=your_app_id');
        console.log('   NEXT_PUBLIC_PARSE_JS_KEY=your_js_key');
        console.log('   NEXT_PUBLIC_PARSE_SERVER_URL=https://parseapi.back4app.com/');
        process.exit(1);
    }

    // 2. Initialize Parse
    console.log('\n📋 2. Initializing Parse SDK...\n');

    try {
        Parse.initialize(appId, jsKey);
        Parse.serverURL = serverURL;
        console.log('   ✅ Parse SDK initialized successfully');
    } catch (error: any) {
        console.log(`   ❌ Parse initialization failed: ${error.message}`);
        process.exit(1);
    }

    // 3. Test connection by creating a test object
    console.log('\n📋 3. Testing connection with a simple query...\n');

    try {
        // Try to count users
        const userQuery = new Parse.Query(Parse.User);
        const userCount = await userQuery.count();
        console.log(`   ✅ Connection successful! Users in _User: ${userCount}`);
    } catch (error: any) {
        console.log(`   ⚠️ Query error (code ${error.code}): ${error.message}`);
        if (error.code === 119) {
            console.log('   This may be due to CLP restrictions. Trying with master key...');
        }
    }

    // 4. Create Super Admin user
    console.log('\n📋 4. Creating Super Admin user...\n');

    const adminEmail = 'syllaharouna740@gmail.com';
    const adminPassword = 'Admin@2025';

    try {
        // First check if user exists
        const existingQuery = new Parse.Query(Parse.User);
        existingQuery.equalTo('email', adminEmail);
        const existingUser = await existingQuery.first({ useMasterKey: false });

        if (existingUser) {
            console.log(`   ⚠️ User already exists with id: ${existingUser.id}`);
            console.log(`   Checking role: ${existingUser.get('role')}`);

            if (existingUser.get('role') !== 'superAdmin') {
                console.log('   Updating role to superAdmin...');
                existingUser.set('role', 'superAdmin');
                await existingUser.save(null, { useMasterKey: false });
                console.log('   ✅ Role updated!');
            }
        } else {
            console.log('   Creating new Super Admin user...');

            const user = new Parse.User();
            user.set('username', adminEmail);
            user.set('email', adminEmail);
            user.set('password', adminPassword);
            user.set('role', 'superAdmin');

            const savedUser = await user.signUp();
            console.log(`   ✅ Super Admin created with id: ${savedUser.id}`);
        }
    } catch (error: any) {
        console.log(`   ❌ Error creating user (code ${error.code}): ${error.message}`);

        if (error.code === 202) {
            console.log('   User with this username already exists. Trying to log in...');
            try {
                const loggedIn = await Parse.User.logIn(adminEmail, adminPassword);
                console.log(`   ✅ Login successful! User id: ${loggedIn.id}`);
                console.log(`   Role: ${loggedIn.get('role')}`);
            } catch (loginError: any) {
                console.log(`   ❌ Login failed: ${loginError.message}`);
            }
        }
    }

    // 5. Test creating an Artisan object
    console.log('\n📋 5. Testing Artisan class creation...\n');

    try {
        const Artisan = Parse.Object.extend('Artisan');
        const testArtisan = new Artisan();

        testArtisan.set('prenom', 'Test');
        testArtisan.set('nom', 'Diagnostic');
        testArtisan.set('telephone', '770000000');
        testArtisan.set('isTestRecord', true);

        const saved = await testArtisan.save();
        console.log(`   ✅ Test Artisan created with id: ${saved.id}`);

        // Clean up - delete test record
        await saved.destroy();
        console.log('   ✅ Test record cleaned up');

    } catch (error: any) {
        console.log(`   ❌ Error creating Artisan (code ${error.code}): ${error.message}`);
    }

    // 6. Verify final state
    console.log('\n📋 6. Final verification...\n');

    try {
        const userQuery2 = new Parse.Query(Parse.User);
        const finalUserCount = await userQuery2.count();
        console.log(`   Users in _User: ${finalUserCount}`);

        const artisanQuery = new Parse.Query('Artisan');
        const artisanCount = await artisanQuery.count();
        console.log(`   Artisans in Artisan class: ${artisanCount}`);

    } catch (error: any) {
        console.log(`   Error in final verification: ${error.message}`);
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    DIAGNOSTIC COMPLETE                         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
}

testBack4App().catch(console.error);
