#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BUMP_TYPES = ['patch', 'minor', 'major'];
const bumpType = process.argv[2] || 'patch';

if (!BUMP_TYPES.includes(bumpType)) {
  console.error(`Usage: node bump-version.js [patch|minor|major]`);
  console.error(`  Default: patch`);
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');
const appJsonPath = path.join(rootDir, 'app.json');
const packageJsonPath = path.join(rootDir, 'package.json');

const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const currentVersion = appJson.expo.version;
const currentVersionCode = appJson.expo.android.versionCode;
const currentBuildNumber = parseInt(appJson.expo.ios.buildNumber, 10);

// Bump semver
const parts = currentVersion.split('.').map(Number);
if (bumpType === 'major') {
  parts[0]++;
  parts[1] = 0;
  parts[2] = 0;
} else if (bumpType === 'minor') {
  parts[1]++;
  parts[2] = 0;
} else {
  parts[2]++;
}
const newVersion = parts.join('.');

// Bump build numbers
const newVersionCode = currentVersionCode + 1;
const newBuildNumber = currentBuildNumber + 1;

// Update app.json
appJson.expo.version = newVersion;
appJson.expo.android.versionCode = newVersionCode;
appJson.expo.ios.buildNumber = String(newBuildNumber);
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Update android/app/build.gradle
const buildGradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');
if (fs.existsSync(buildGradlePath)) {
  let gradle = fs.readFileSync(buildGradlePath, 'utf8');
  gradle = gradle.replace(/versionCode \d+/, `versionCode ${newVersionCode}`);
  gradle = gradle.replace(/versionName ".*?"/, `versionName "${newVersion}"`);
  fs.writeFileSync(buildGradlePath, gradle);
  console.log('Updated android/app/build.gradle');
}

console.log(`Bumped version: ${currentVersion} -> ${newVersion}`);
console.log(`Android versionCode: ${currentVersionCode} -> ${newVersionCode}`);
console.log(`iOS buildNumber: ${currentBuildNumber} -> ${newBuildNumber}`);
