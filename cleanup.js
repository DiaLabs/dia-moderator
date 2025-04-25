#!/usr/bin/env node

/**
 * Cleanup script to remove old directories after restructuring
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to be removed
const oldDirectories = [
  'discord_bot',
  'telegram_bot',
  'whatsapp_bot',
  'frontend'
];

// Files to be removed
const oldFiles = [
  'server.js'
];

console.log('Starting cleanup process...');

// Remove old directories
oldDirectories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    try {
      console.log(`Removing directory: ${dir}`);
      if (process.platform === 'win32') {
        // Windows requires a different command for removing directories with content
        execSync(`rmdir /s /q "${dirPath}"`);
      } else {
        execSync(`rm -rf "${dirPath}"`);
      }
      console.log(`Successfully removed: ${dir}`);
    } catch (error) {
      console.error(`Error removing directory ${dir}:`, error.message);
    }
  } else {
    console.log(`Directory already removed: ${dir}`);
  }
});

// Remove old files
oldFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      console.log(`Removing file: ${file}`);
      fs.unlinkSync(filePath);
      console.log(`Successfully removed: ${file}`);
    } catch (error) {
      console.error(`Error removing file ${file}:`, error.message);
    }
  } else {
    console.log(`File already removed: ${file}`);
  }
});

console.log('Cleanup completed!');
console.log('The project has been successfully restructured.');
console.log('You can now run the application with: npm start');