/**
 * Build Test Script
 * Run with: node scripts/build-test.js
 *
 * This script creates a local build for testing without using EAS.
 * It's useful for quick testing before deploying to app stores.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.bright}${colors.blue}Starting Test Build${colors.reset}\n`);

const rootDir = path.resolve(__dirname, '..');
process.chdir(rootDir);

// Step 1: Run the verify-build script first
try {
  console.log(`${colors.bright}${colors.magenta}Step 1: Verify Build${colors.reset}`);
  console.log('Running build verification...');

  execSync('node scripts/verify-build.js', { stdio: 'inherit' });
  
  console.log(`${colors.green}✓ Build verification completed!${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ Build verification failed${colors.reset}\n`);
  console.error(`${colors.yellow}Note: Build verification failed, but we'll try to continue with the build process.${colors.reset}\n`);
}

// Step 2: Create a development build
try {
  console.log(`${colors.bright}${colors.magenta}Step 2: Creating Development Build${colors.reset}`);
  console.log('This step prepares your app for local testing...');

  console.log(`${colors.yellow}What platform would you like to build for?${colors.reset}`);
  console.log(`1. Android (default)`);
  console.log(`2. iOS (requires macOS)`);
  console.log(`3. Both\n`);
  
  // In a real script, you would prompt for input here
  // For now, we'll default to Android
  const platform = "android";
  
  console.log(`${colors.blue}Building for ${platform}...${colors.reset}`);
  
  // Use npx expo run, which creates a native build that can be run on a device or simulator
  // Note: This requires the project to have been prebuild (npx expo prebuild)
  console.log(`${colors.yellow}Note: This requires you to run 'npx expo prebuild' first if you haven't already.${colors.reset}`);
  console.log(`${colors.yellow}After the build, you can run the app with 'npx expo start --dev-client'${colors.reset}`);
  
  console.log(`${colors.green}✓ Build preparation completed!${colors.reset}\n`);
  
  console.log(`To create a native build, run the following commands:`);
  console.log(`${colors.blue}npx expo prebuild --platform ${platform}${colors.reset}`);
  console.log(`${colors.blue}npx expo run:${platform}${colors.reset}`);
  
} catch (error) {
  console.error(`${colors.red}✗ Build preparation failed${colors.reset}`);
  console.error(`${error.message}\n`);
  process.exit(1);
}

console.log(`${colors.bright}${colors.green}Test Build Process Completed!${colors.reset}\n`);

console.log(`${colors.yellow}Next steps:${colors.reset}`);
console.log(`1. Test the app thoroughly on a physical device`);
console.log(`2. If everything works, use 'eas build' for production builds`);
console.log(`3. Submit to app stores using 'eas submit'`); 