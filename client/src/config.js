/**
 * Frontend application configuration
 */

// Base URL for API calls
export const API_BASE_URL = '/api';

// Bot configuration
export const BOT_CONFIG = {
  discord: {
    name: 'Discord Bot',
    description: 'Moderate your Discord server with automatic content filtering, warning systems, and more.',
    image: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png'
  },
  whatsapp: {
    name: 'WhatsApp Bot',
    description: 'Keep your WhatsApp groups clean with AI-powered moderation and smart features.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/640px-WhatsApp.svg.png'
  },
  telegram: {
    name: 'Telegram Bot',
    description: 'Enhance your Telegram channels with automated moderation, summarization, and conversation assistance.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/640px-Telegram_logo.svg.png'
  }
};

// Application settings
export const APP_CONFIG = {
  title: 'Dia-Moderator',
  apiPollingInterval: 2000, // ms
  qrCodeRefreshThreshold: 5 // seconds
};

// Environment-specific settings
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Add any other configuration values the application might need