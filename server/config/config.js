/**
 * Main configuration file for Dia-Moderator
 * Centralizes all configuration settings for the application
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Default values for environment variables
const defaults = {
  PORT: 3001,
  MAX_MESSAGES: 15,
  PROFANITY_LIMIT: 3,
  SPAM_LIMIT: 5,
  SPAM_TIME_WINDOW: 60000, // 1 minute in milliseconds
  GEMINI_MODEL: 'gemini-2.0-flash'
};

// Environment variable getter with defaults
const env = (key) => process.env[key] || defaults[key];

const config = {
  // Server settings
  server: {
    port: parseInt(env('PORT')),
    clientPath: path.join(__dirname, '../../client/build')
  },
  
  // Bot settings
  bots: {
    // Shared settings
    shared: {
      profanityListPath: path.join(__dirname, '../../shared/profanity-list.json'),
      maxMessages: parseInt(env('MAX_MESSAGES')),
      profanityLimit: parseInt(env('PROFANITY_LIMIT')),
      spamLimit: parseInt(env('SPAM_LIMIT')),
      spamTimeWindow: parseInt(env('SPAM_TIME_WINDOW'))
    },
    
    // Discord specific settings
    discord: {
      token: process.env.DISCORD_TOKEN,
      path: path.join(__dirname, '../bots/discord/discord_bot.js')
    },
    
    // WhatsApp specific settings
    whatsapp: {
      path: path.join(__dirname, '../bots/whatsapp/whatsapp_bot.js')
    },
    
    // Telegram specific settings
    telegram: {
      token: process.env.TELEGRAM_TOKEN,
      path: path.join(__dirname, '../bots/telegram/telegram_bot.js')
    }
  },
  
  // AI settings
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: env('GEMINI_MODEL')
  }
};

module.exports = config;